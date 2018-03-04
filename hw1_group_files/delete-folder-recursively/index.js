/**
 * Created by Leo on 3/4/2018.
 */

const fs = require('fs');
const path = require('path');

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

module.exports = deleteFolderRecursively;
