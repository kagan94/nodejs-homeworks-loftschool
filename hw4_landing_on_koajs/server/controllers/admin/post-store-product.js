const path = require('path');
const DBService = require('../../services/db');

module.exports = async ctx => {
  const fields = ctx.request.body.fields;
  const files = ctx.request.body.files;

  const fileKey = Object.keys(files)[0];
  const file = fileKey ? files[fileKey] : null;

  if (files.length === 0 || file.size === 0) {
    ctx.addError('File was not supplied or empty');
    return ctx.redirect('back');
  }

  try {
    const filename = path.basename(file.path);
    const product = {
      'name': fields.name,
      'photo': filename,
      'price': parseFloat(fields.price)
    };
    await DBService.addProduct(product);

    ctx.addSuccess('Product was added successfully');
  } catch (err) {
    ctx.addError(err.message);
  }
  ctx.redirect('back');
};
