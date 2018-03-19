const EmailService = require('../../services/email');

module.exports = async ctx => {
  const data = ctx.request.body;

  try {
    await EmailService.sendEmail(data);
    ctx.addSuccess('Your message was sent successfully');
  } catch (err) {
    ctx.addError(err.message);
  }
  ctx.redirect('/');
};
