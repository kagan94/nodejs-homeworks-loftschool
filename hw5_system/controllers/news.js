const sequelize = require('../helpers/sequelize');

const getNews = () => {
  return sequelize.models.news.findAll({include: [sequelize.models.user]});
};

module.exports.getNews = async (req, res) => {
  // req.session.reload();
  console.log(req.session.accessToken, 'accessTokenNews');
  const news = await getNews();
  res.send(news);
};

module.exports.createNews = async (req, res) => {
  await sequelize.models.news.create({
    theme: req.body.theme,
    date: req.body.date,
    text: req.body.text,
    userId: req.user.id
  });

  const news = await getNews();
  res.send(news);
};

module.exports.updateNews = async (req, res) => {
  const newsId = req.params.id;
  const news = await sequelize.models.news.find({where: {id: newsId}});
  if (!news) {
    return res.status(400);
  }

  await news.update({
    date: req.body.date,
    theme: req.body.theme,
    text: req.body.text
  });

  const newsList = await getNews();
  res.send(newsList);
};

module.exports.deleteNews = async (req, res) => {
  const newsId = req.params.id;
  const news = await sequelize.models.news.find({where: {id: newsId}});
  if (news) {
    await news.destroy();
  }

  const newsList = await getNews();
  res.send(newsList);
};
