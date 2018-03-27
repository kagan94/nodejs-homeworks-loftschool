const path = require('path');
const fs = require('fs');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const express = require('express');
const sequelize = require('./helpers/sequelize');
const config = require('./helpers/config');
const enableChat = require('./controllers/chat');

const app = express();
const server = require('http').createServer(app);
const PORT = process.env.PORT || 8080;
enableChat(server);

app.use(logger('dev'));

app.use(session({
  secret: config.secretKey,
  key: 'session.id',
  cookie: {
    path: '/',
    httpOnly: false,
    maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
    secure: false
  },
  saveUninitialized: false,
  resave: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

function main () {
  // Routes
  app.use('/api', require('./routes/api'));

  app.get('*', function (req, res) {
    res.send(fs.readFileSync(path.resolve(path.join('public', 'index.html')), 'utf8'));
  });

  server.listen(PORT);
  console.log('Started listening on port %s. Environment: ', PORT, config.env);
}

sequelize
  .authenticate()
  .then(() => {
    console.log('Соединение установлено');

    // Bind DB models
    const modelNames = ['User', 'News'];
    for (const modelName of modelNames) {
      sequelize.import(`./models/${modelName}.js`);
    }
    for (const modelName of Object.keys(sequelize.models)) {
      if ('associate' in sequelize.models[modelName]) {
        sequelize.models[modelName].associate(sequelize.models);
      }
    }
    sequelize.sync();

    main();
  })
  .catch((err) => {
    console.log('Ошибка соединения', err.message);
  });

module.exports = server;
