/**
 * Created by Leo on 2/28/2018.
 */

const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const mkdirSync = require('mkdirp-sync');
const argv = require('optimist').argv;
const deleteFolderRecursively = require('./delete-folder-recursively');

const srcDir = path.normalize(argv.sourceDir || path.join(__dirname, 'sourceDir'));
const resDir = path.normalize(argv.resultDir || path.join(__dirname, 'output'));
const removeSrcFiles = !!argv.removeSrcFiles || false;

const cleanOutputFolder = (function () {
  return (outputDir, cb) => {
    if (fs.existsSync(outputDir)) {
      const deleteSelfFolder = false;
      return deleteFolderRecursively(outputDir, cb, deleteSelfFolder);
    }
    // Create target dir recursively
    mkdirp(outputDir, (err) => {
      if (err) return cb(err);
      return cb(false);
    });
  };
})();

// Sync Save file
const saveFileToOutput = (function () {
  return (fullFilePath, filename) => {
    const classDir = filename[0].toUpperCase();
    const fileExt = path.extname(filename).slice(1);
    const classDirPath = path.join(resDir, fileExt, classDir);
    const newFilePath = path.join(classDirPath, filename);

    // Create target dir recursively
    if (!fs.existsSync(classDirPath)) {
      mkdirSync(classDirPath);
    }

    if (fs.existsSync(newFilePath))
      console.log('Filename ' + filename + ' already exists in output folder');

    try {
      fs.copyFileSync(fullFilePath, newFilePath);
    } catch (err) {
      console.log('onCopyFileError', err.message);
    }
  };
})();

const groupFiles = (function (removeSrcFiles) {
  return (tgtDirPath, deleteSelfDir = false) => {
    let nextPathDeleteSelfFolder = removeSrcFiles;

    fs.readdirSync(tgtDirPath).forEach((filename, idx) => {
      const fpath = path.join(tgtDirPath, filename);
      const fstats = fs.statSync(fpath);

      if (fstats.isDirectory()) {
        const nextPath = path.join(tgtDirPath, filename);
        groupFiles(nextPath, nextPathDeleteSelfFolder);
      } else {
        saveFileToOutput(fpath, filename);
        if (removeSrcFiles)
          fs.unlinkSync(fpath);
      }
    });
    if (deleteSelfDir)
      fs.rmdirSync(tgtDirPath);
  };
})(removeSrcFiles);

if (!fs.existsSync(srcDir)) {
  console.log('Source folder does not exist');
  process.exit(1);
}

cleanOutputFolder(resDir, (err) => {
  if (err) return console.log(err);

  console.log('Output folder was cleaned successfully');
  console.log('Start grouping files/dirs');

  mkdirp(srcDir, (err) => {
    if (err) return console.log(err);

    const deleteSelfDir = false;
    groupFiles(srcDir, deleteSelfDir);
  });
});
