module.exports = (sequelize, DataTypes) => {
  const News = sequelize.define('news', {
    theme: {
      type: DataTypes.STRING
    },
    date: {
      type: DataTypes.DATE
    },
    text: {
      type: DataTypes.STRING
    },
    timestamps: true
  });
  News.associate = function (models) {
    News.belongsTo(models.user);
  };
  return News;
};
