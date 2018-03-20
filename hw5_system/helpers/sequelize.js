const config = require('./config');
const dbConfig = config.orm.sequelize;

const Sequelize = require('sequelize');
const sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
  host: dbConfig.host,
  port: dbConfig.port,
  dialect: dbConfig.dialect,
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});
sequelize.sync();

// Bind DB models
const modelNames = ['User', 'News'];
for (const modelName of modelNames) {
  sequelize.import(`../models/${modelName}.js`);
}
for (const modelName of Object.keys(sequelize.models)) {
  if ('associate' in sequelize.models[modelName]) {
    sequelize.models[modelName].associate(sequelize.models);
  }
}

module.exports = sequelize;
