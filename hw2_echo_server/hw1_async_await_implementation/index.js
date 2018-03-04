const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const util = require('util');
const argv = require('optimist').argv;

const srcDir = path.normalize(argv.sourceDir || path.join(__dirname, 'sourceDir'));
const resDir = path.normalize(argv.resultDir || path.join(__dirname, 'output'));
const removeSrcFiles = !!argv.removeSrcFiles || false;

const mkdirpPromise = util.promisify(mkdirp);
const fsReaddirPromise = util.promisify(fs.readdir);
const fsRmdirPromise = util.promisify(fs.rmdir);
const fsStatPromise = util.promisify(fs.stat);
const fsUnlinkPromise = util.promisify(fs.unlink);
const fsCopyFilePromise = util.promisify(fs.copyFile);

const main = async () => {
  if (!fs.existsSync(srcDir)) {
    throw new Error('Source folder does not exist');
  }

  await cleanOutputFolder(resDir);
  await mkdirpPromise(srcDir);

  const deleteSelfDir = false;
  await groupFiles(srcDir, deleteSelfDir);
};

const cleanOutputFolder = async (outputDir) => {
  if (fs.existsSync(outputDir)) {
    const deleteSelfFolder = false;
    return deleteFolderRecursively(outputDir, deleteSelfFolder);
  }
  // Create target dir recursively
  await mkdirpPromise(outputDir);
};

const deleteFolderRecursively = async (resourcePath, deleteSelfFolder = true) => {
  const resources = await fsReaddirPromise(resourcePath);
  let promiseTasks = [];

  if (resources.length === 0) {
    if (deleteSelfFolder)
      await fsRmdirPromise(resourcePath);
    return;
  }

  for (let i = 0; i < resources.length; i++) {
    let runTask = async function () {
      const targetPath = path.join(resourcePath, resources[i]);
      const targetStat = await fsStatPromise(targetPath);

      if (targetStat.isDirectory()) {
        await deleteFolderRecursively(targetPath, true);
      } else {
        await fsUnlinkPromise(targetPath);
      }
    };
    promiseTasks.push(runTask());
  }

  await Promise.all(promiseTasks);

  if (deleteSelfFolder) {
    try {
      await fsRmdirPromise(resourcePath);
    } catch (err) {
      console.log('deleteSelfFolder', resourcePath, err);
    }
  }
};

const groupFiles = async (tgtDirPath, deleteSelfDir = false) => {
  const nextPathDeleteSelfFolder = removeSrcFiles;
  const files = await fsReaddirPromise(tgtDirPath);

  Promise.all(files.map(async (filename) => {
    const fpath = path.join(tgtDirPath, filename);
    const fstats = fs.statSync(fpath);

    if (fstats.isDirectory()) {
      const nextPath = path.join(tgtDirPath, filename);
      return groupFiles(nextPath, nextPathDeleteSelfFolder);
    } else {
      await saveFileToOutput(fpath, filename);
      if (removeSrcFiles)
        fs.unlinkSync(fpath);
    }
  }));

  if (deleteSelfDir)
    await fsRmdirPromise(tgtDirPath);
};

const saveFileToOutput = async (fullFilePath, filename) => {
  const classDir = filename[0].toUpperCase();
  const fileExt = path.extname(filename).slice(1);
  const classDirPath = path.join(resDir, fileExt, classDir);
  const newFilePath = path.join(classDirPath, filename);

  // Create target dir recursively
  if (!fs.existsSync(classDirPath))
    await mkdirpPromise(classDirPath);

  if (fs.existsSync(newFilePath))
    console.log('Filename ' + filename + ' already exists in output folder');

  fsCopyFilePromise(fullFilePath, newFilePath)
    .catch(console.log.bind(console));
};

main()
  .then(() => console.log('Done'))
  .catch(err => console.error(err.message));
