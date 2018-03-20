const Pug = require('koa-pug');
const koaBody = require('koa-body');
const compress = require('koa-compress');
const session = require('koa-session');
const logger = require('koa-logger');
const serve = require('koa-static');
const flash = require('koa-connect-flash');
const Koa = require('koa');
const path = require('path');
const app = new Koa();

const PORT = 3002;
const env = process.env.NODE_ENV || 'development';
const router = require('./server/routes');
const pugMiddleware = require('./server/middlewares/pug');
const koaSessionMiddleware = require('./server/middlewares/koa-session');

app.keys = ['secretKeyHere..123'];

app.use(logger());
app.use(serve(path.join(__dirname, 'public')));
app.use(koaBody());

pugMiddleware.options.app = app;
app.pug = new Pug(pugMiddleware.options);

koaSessionMiddleware.options.app = app;
app.use(session(koaSessionMiddleware.options, app));
app.use(flash());

// Error handler
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.error(err);
    ctx.app.pug.locals.error = env === 'development' ? err : {};

    ctx.body = ctx.app.pug.render('pages/error');
    ctx.status = 404;
  }
});

// Helpers for attaching msg(s)
app.use(async (ctx, next) => {
  ctx.addError = (msg) => {
    const errors = ctx.flash('errors') || [];
    errors.push(msg);
    ctx.flash('errors', errors);
  };

  ctx.addSuccess = (msg) => {
    ctx.flash('success', msg);
  };

  ctx.renderPage = (pageName, data = {}) => {
    const pageData = Object.assign({}, ctx.app.pug.locals, data);
    return ctx.app.pug.render(pageName, pageData);
  };
  await next();
});

// Enable flash msg(s)
app.use(async (ctx, next) => {
  ctx.app.pug.locals.success = ctx.flash('success') || '';
  ctx.app.pug.locals.errors = ctx.flash('errors') || [];

  await next();
});

app.use(router.routes());
app.use(compress());

if (!module.parent) {
  app.listen(PORT);
  console.log('listening on port ' + PORT);
}
