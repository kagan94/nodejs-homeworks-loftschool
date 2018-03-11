const DBService = require('../../services/db');

module.exports = async ctx => {
  const {email, password} = ctx.request.body;
  const user = await DBService.findUserByEmail(email);

  if (!user) {
    ctx.addError('User not found');
  } else if (user.password !== password) {
    ctx.addError('Password is wrong');
  } else {
    ctx.addSuccess('Successfully authorized');
    ctx.session.isAdmin = true;

    return ctx.redirect('/admin');
  }
  ctx.redirect('back');
};
