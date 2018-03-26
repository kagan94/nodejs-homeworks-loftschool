const bCrypt = require('bcryptjs');
const jwt = require('jwt-simple');
const config = require('../helpers/config');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id'
    },
    permissionId: {
      type: DataTypes.INTEGER
    },
    access_token: {
      type: DataTypes.STRING
    },
    firstName: {
      type: DataTypes.STRING
    },
    surName: {
      type: DataTypes.STRING
    },
    middleName: {
      type: DataTypes.STRING
    },
    username: {
      type: DataTypes.STRING
      // unique: true
    },
    password: {
      type: DataTypes.STRING
    },
    image: {
      type: DataTypes.STRING
    },
    permission: {
      type: DataTypes.JSONB
    }
  }, {
    timestamps: true
  });
  User.associate = function (models) {
    User.hasMany(models.news);
  };

  User.prototype.encodeToken = function () {
    const payload = {id: this.id};
    const token = jwt.encode(payload, config.secretKey);
    return token;
  };

  User.prototype.isPasswordValid = function (password) {
    return bCrypt.compareSync(password, this.password);
  };

  return User;
};
