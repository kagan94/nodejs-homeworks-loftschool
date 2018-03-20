module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    email: {
      type: DataTypes.STRING
    },
    name: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
    },
    avatar: {
      type: DataTypes.STRING
    }
    // __id: {
    //   type: DataTypes.UUID,
    //   defautValue: DataTypes.UUIDV4
    // }
    // TODO: Add all fields required for user
  });
  User.associate = function (models) {
    User.hasMany(models.news);
  };
  return User;
};
