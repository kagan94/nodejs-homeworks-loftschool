/**
 * Created by Leo on 3/10/2018.
 */
const path = require('path');
const fs = require('fs');

var FileService = function () {};

FileService.prototype.uploadFile = (files, uploadsDir) => {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
  }

  return new Promise((resolve, reject) => {
    const fileKey = Object.keys(files)[0];
    const file = fileKey ? files[fileKey] : null;

    if (files.length === 0) return reject(new Error('File was not supplied'));
    if (file.size === 0) return reject(new Error('File is empty'));

    const fileExt = file.name.split('.').pop();
    const newFileName = Date.now() + '.' + fileExt;

    const oldPath = file.path;
    const newPath = path.join(uploadsDir, newFileName);

    fs.rename(oldPath, newPath, function (err) {
      if (err)
        return reject(err);
      resolve({fileName: newFileName});
    });
  });
};

module.exports = new FileService();
