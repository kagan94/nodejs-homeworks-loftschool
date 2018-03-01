/**
 * Created by Leo on 2/28/2018.
 */

const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const argv = require('optimist').argv;

const srcDir = path.normalize(argv.sourceDir || path.join(__dirname, 'sourceDir'));
const resDir = path.normalize(argv.resultDir || path.join(__dirname, 'output'));
const removeSrcFiles = !!argv.removeSrcFiles;

if (!fs.existsSync(srcDir)) {
  console.log('Target folder does not exist');
  process.exit(1);
}

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

const deleteFolderRecursively = (tgtPath, cb) => {
  fs.stat(tgtPath, function (err, tgtPathFstat) {
    if (err) return cb(err);

    fs.readdir(tgtPath, function (err, files) {
      const totalResources = files.length;
      let totalProcessed = 0;

      // Check if we can remove target dir
      const checkAndRemoveDir = function (resourcePath, _totalResources, _totalProcessed) {
        console.log(_totalProcessed, _totalResources);
        if (_totalProcessed === _totalResources) {
          console.log('should remove dir: ' + resourcePath);
          const removeCurrentFolderCb = function (err) {
            if (err) return cb(err);
            cb(false);
          };
          fs.rmdir(resourcePath, removeCurrentFolderCb);
        }
      };

      files.forEach((file, idx) => {
        const fpath = path.join(tgtPath, file);

        fs.stat(fpath, function (err, fstats) {
          if (err) return cb(err);

          // Remove folder
          if (fstats.isDirectory()) {
            const deleteSubfolderCb = function (err) {
              if (err) return cb(err);

              totalProcessed++;
              console.log(totalProcessed, totalResources);
              checkAndRemoveDir(fpath, totalResources, totalProcessed);
            };
            deleteFolderRecursively(fpath, deleteSubfolderCb);
          } else {
            // Remove file
            fs.unlink(fpath, function (err) {
              console.log(err);
              if (err) return cb(err);

              totalProcessed++;
              checkAndRemoveDir(fpath, totalResources, totalProcessed);
            });
          }
        });
        checkAndRemoveDir(fpath, totalResources, totalProcessed);
      });
    });
  });
};

deleteFolderRecursively(resDir, (err, res) => {
  if (err) process.exit(1);

  console.log('deletion was done', res);
});

// Sync Save file
// const saveFileToOutput = (fullFilePath, filename, fileStats) => {
//   const classDir = filename[0].toUpperCase();
//   const fileExt = path.extname(filename).slice(1);
//   const newFilePath = path.join(resDir, fileExt, classDir, filename);
//
//   // Create target dir recursively
//   mkdirp(newFilePath, (err) => {
//     if (err) {
//       return console.log(err);
//     } else {
//       if (fs.existsSync(newFilePath)) {
//         return console.log('Filename %s already exists in output folder', filename);
//       }
//
//       fs.copyFile(fullFilePath, newFilePath, (err) => {
//         if (err) return console.log(err.message);
//
//         console.log('Copied successfully');
//       });
//     }
//   });
// };
//
// const groupFiles = (tgtPath) => {
//   fs.readdirSync(tgtPath).forEach((filename, idx) => {
//     const fpath = path.join(tgtPath, filename);
//     const fstats = fs.statSync(fpath);
//
//     if (fstats.isDirectory()) {
//       const nextPath = path.join(tgtPath, filename);
//       groupFiles(nextPath);
//     } else {
//       saveFileToOutput(fpath, filename, fstats);
//
//       if (removeSrcFiles) {
//         fs.unlinkSync(fpath);
//       }
//     }
//   });
// };
//
// groupFiles(srcDir);
