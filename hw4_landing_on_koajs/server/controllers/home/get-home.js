const DBService = require('../../services/db');

module.exports = async (ctx) => {
  const data = {};
  const skills = DBService.getSkills();

  data.skills = [
    {
      'number': skills.age || '',
      'text': 'Возраст начала занятий на скрипке'
    },
    {
      'number': skills.concerts || '',
      'text': 'Концертов отыграл'
    },
    {
      'number': skills.cities || '',
      'text': 'Максимальное число городов в туре'
    },
    {
      'number': skills.years || '',
      'text': 'Лет на сцене в качестве скрипача'
    }
  ];
  data.products = DBService.getProducts();

  ctx.body = ctx.renderPage('pages/home', data);
};
