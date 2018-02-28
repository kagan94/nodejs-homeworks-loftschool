/**
 * Created by Leo on 2/28/2018.
 */

const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

const tgtDir = path.normalize(process.argv[2]);
const resDir = path.join(__dirname, 'output');

if (!fs.existsSync(tgtDir)) {
  console.log('Target folder does not exist');
  process.exit(1);
}

const deleteFolderRecursively = (tgtPath) => {
  if (!fs.existsSync(tgtPath)) return;

  fs.readdirSync(tgtPath).forEach((file, idx) => {
    const fpath = path.join(tgtPath, file);
    const fstats = fs.statSync(fpath);

    if (fstats.isDirectory()) {
      deleteFolderRecursively(tgtPath);
    } else {
      fs.unlinkSync(fpath); // remove file
    }
    fs.rmdirSync(tgtPath); // remove folder
  });
};

const saveFileToOutput = (fullFilePath, filename, fileStats) => {
  const classDir = filename[0].toUpperCase();
  const newFilePath = path.join(resDir, classDir, filename);

  // Create target dir recursively
  mkdirp(newFilePath, (err) => {
    if (err) {
      return console.log(err);
    } else {
      fs.copyFile(fullFilePath, newFilePath, (err) => {
        if (err) return console.log(err.message);

        console.log('Copied successfully');
      });
    }
  });
};

const classifyFiles = (tgtPath) => {
  fs.readdirSync(tgtPath).forEach((filename, idx) => {
    const fpath = path.join(tgtPath, filename);
    const fstats = fs.statSync(fpath);

    if (fstats.isDirectory()) {
      const nextPath = path.join(tgtPath, filename);
      classifyFiles(nextPath);
    } else {
      saveFileToOutput(fpath, filename, fstats);
      // fs.unlinkSync(fpath); // remove file
    }
  });
};

// Clean previous results
console.log(resDir);

// RangeError: Maximum call stack size exceeded
// setTimeout(() => {
  deleteFolderRecursively(resDir, () => {
    console.log('DONE');
  });
// }, 0);

// classifyFiles(tgtDir);
