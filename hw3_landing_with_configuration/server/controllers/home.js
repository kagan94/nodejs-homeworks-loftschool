const DBService = require('../services/db');
const EmailService = require('../services/email');

module.exports.getIndex = (req, res) => {
  const skills = DBService.getSkills();

  res.locals.skills = [
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
  res.locals.products = DBService.getProducts();

  res.render('pages/home');
};

module.exports.sendEmail = (req, res) => {
  const data = req.body;

  EmailService.sendEmail(data)
    .then(() => {
      req.addError('Your message was sent successfully');
      res.redirectBack();
    })
    .catch(err => {
      req.addError(err.message);
      res.redirectBack();
    });
};
