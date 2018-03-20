const path = require('path');
const fs = require('fs');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const express = require('express');
const sequelize = require('./helpers/sequelize');
const config = require('./helpers/config');

const app = express();
const PORT = 3000;

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

function main () {
  // Routes
  app.use('/api', require('./routes/api'));

  app.get('*', function (req, res) {
    res.send(fs.readFileSync(path.resolve(path.join('public', 'index.html')), 'utf8'));
  });

  app.listen(PORT);
  logger.log('Started listening on port %s. Environment: ', PORT, config.env);
}

sequelize
  .authenticate()
  .then(() => {
    logger.log('Соединение установлено');
    main();
  })
  .catch((err) => {
    logger.log('Ошибка соединения', err.message);
  });
