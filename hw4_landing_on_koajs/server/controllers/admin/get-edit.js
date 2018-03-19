const DBService = require('../../services/db');

module.exports = async ctx => {
  const data = {
    skills: DBService.getSkills()
  };

  ctx.render('pages/admin', data);
};
