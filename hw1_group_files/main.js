/**
 * Created by Leo on 2/28/2018.
 */

const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const mkdirSync = require('mkdirp-sync');
const argv = require('optimist').argv;

const srcDir = path.normalize(argv.sourceDir || path.join(__dirname, 'sourceDir'));
const resDir = path.normalize(argv.resultDir || path.join(__dirname, 'output'));
const removeSrcFiles = !!argv.removeSrcFiles || false;

// Sync. method
// const deleteFolderRecursively = (tgtPath) => {
//   if (!fs.existsSync(tgtPath)) return;
//
//   fs.readdirSync(tgtPath).forEach((file, idx) => {
//     const fpath = path.join(tgtPath, file);
//     const fstats = fs.statSync(fpath);
//
//     if (fstats.isDirectory()) {
//       deleteFolderRecursively(fpath);
//       fs.rmdirSync(fpath); // remove folder
//     } else {
//       fs.unlinkSync(fpath); // remove file
//     }
//   });
// };

const deleteFolderRecursively = (resourcePath, cb, deleteSelfFolder = true) => {
  fs.stat(resourcePath, function (err) {
    if (err) return cb(err);

    fs.readdir(resourcePath, function (err, files) {
      const totalResources = files.length;
      let totalProcessed = 0;

      // Check if we can remove target dir
      const checkAndRemoveDir = function () {
        if (totalProcessed === totalResources) {
          const removeCurrentFolderCb = function (err) {
            if (err) return cb(err);

            return cb(false);
          };

          if (deleteSelfFolder)
            return fs.rmdir(resourcePath, removeCurrentFolderCb);
          return cb(false);
        }
      };

      if (totalResources === 0) {
        return checkAndRemoveDir();
      }

      files.forEach(function (file, idx) {
        const fpath = path.join(resourcePath, file);

        fs.stat(fpath, function (err, fstats) {
          if (err) return cb(err);

          // Remove folder
          if (fstats.isDirectory()) {
            const deleteSubfolderCb = function (err) {
              if (err) return cb(err);

              totalProcessed++;
              // console.log(totalProcessed, totalResources);
              checkAndRemoveDir();
            };
            deleteFolderRecursively(fpath, deleteSubfolderCb);
          } else {
            // Remove file
            fs.unlink(fpath, function (err) {
              if (err) return cb(err);

              totalProcessed++;
              checkAndRemoveDir();
            });
          }
        });
      });
    });
  });
};

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

    const deleteSelfDir = true;
    groupFiles(srcDir, deleteSelfDir);
  });
});
