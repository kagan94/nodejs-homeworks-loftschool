const formidable = require('formidable');
const path = require('path');
const DBService = require('../services/db');
const FileService = require('../services/file');

const productUploadsDir = path.join(process.cwd(), 'public', 'uploads', 'products');

module.exports.edit = (req, res) => {
  res.locals.skills = DBService.getSkills();

  res.render('pages/admin');
};

module.exports.update = (req, res) => {
  const skills = req.body;
  DBService.saveSkills(skills);

  req.addSuccess('Skills were updated successfully');
  res.redirectBack();
};

module.exports.storeProduct = (req, res) => {
  const form = new formidable.IncomingForm();

  form.uploadDir = productUploadsDir;

  form.parse(req, function (err, fields, files) {
    if (err) {
      req.addError('Error occurred while saving ' + err.message);
      return res.redirectBack();
    }

    FileService.uploadFile(files, productUploadsDir)
      .then(data => {
        const product = {
          'name': fields.name,
          'photo': data.fileName,
          'price': parseFloat(fields.price)
        };
        DBService.addProduct(product);

        req.addSuccess('Product was added successfully');
        res.redirectBack();
      })
      .catch(err => {
        req.addError(err.message);
        return res.redirectBack();
      });
  });
};
