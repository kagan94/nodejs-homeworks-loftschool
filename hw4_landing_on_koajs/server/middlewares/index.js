const path = require('path');
const koaBody = require('koa-body');

module.exports.koaFileBody = koaBody({
  multipart: true,
  formidable: {
    uploadDir: path.join(process.cwd(), 'public', 'uploads', 'products'),
    keepExtensions: true
  }
});

module.exports.isAdmin = async (ctx, next) => {
  if (ctx.session && ctx.session.isAdmin) {
    return next();
  }
  ctx.addError('You are not logged in as Admin!');
  ctx.redirect('/login');
};
