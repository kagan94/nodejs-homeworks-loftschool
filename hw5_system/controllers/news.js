const sequelize = require('../helpers/sequelize');

const getNews = () => {
  return sequelize.models.news.findAll();
};

module.exports.getNews = async (req, res) => {
  const news = await getNews();
  res.send(news);
};

module.exports.createNews = async (req, res) => {
  await sequelize.models.news.create({
    theme: req.body.theme,
    date: new Date(),
    text: req.body.text
  });

  const news = await getNews();
  res.send(news);
};

module.exports.updateNews = async (req, res) => {
  const newsId = req.params.id;
  const news = await sequelize.models.news.find({where: {id: newsId}});
  if (!news)
    return res.status(400);

  await news.update({
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
    return res.status(200);
  }
  res.status(410);
};
