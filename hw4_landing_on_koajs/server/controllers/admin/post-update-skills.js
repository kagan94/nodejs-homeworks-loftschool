const DBService = require('../../services/db');

module.exports = async ctx => {
  const skills = ctx.request.body;
  await DBService.saveSkills(skills);

  ctx.addSuccess('Skills were updated successfully');
  ctx.redirect('back');
};
