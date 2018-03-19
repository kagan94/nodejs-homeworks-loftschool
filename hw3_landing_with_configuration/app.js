const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');

const app = express();
const serverRoot = path.join(__dirname, 'server');
const PORT = 3001;

// view engine setup
app.set('views', path.join(serverRoot, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
  secret: 'secretKeyHere..123',
  key: 'key',
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: 30 * 60 * 1000
  },
  saveUninitialized: false,
  resave: false
}));
app.use(cookieParser());
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

// Helpers for attaching msg(s)
app.use(function (req, res, next) {
  req.addError = (msg) => {
    const errors = req.flash('errors') || [];
    errors.push(msg);
    req.flash('errors', errors);
  };

  req.addSuccess = (msg) => {
    req.flash('success', msg);
  };
  next();
});

// Enable flash msg(s)
app.use(function (req, res, next) {
  res.locals.success = req.flash('success') || '';
  res.locals.errors = req.flash('errors') || [];
  next();
});

// Enable "redirectBack" functionality
app.use(function (req, res, next) {
  res.redirectBack = () => {
    const backURL = req.header('Referer') || '/';
    return res.redirect(backURL);
  };
  next();
});

app.use('', require('./server/routes'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('pages/error');
});

app.listen(PORT);
