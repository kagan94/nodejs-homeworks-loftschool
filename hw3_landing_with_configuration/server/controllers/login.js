const DBService = require('../services/db');

module.exports.getIndex = (req, res) => {
  res.render('pages/login');
};

module.exports.postLogin = (req, res) => {
  const {email, password} = req.body;
  const user = DBService.findUserByEmail(email);

  if (!user) {
    req.addError('User not found');
  } else if (user.password !== password) {
    req.addError('Password is wrong');
  } else {
    req.addSuccess('Successfully authorized');
    req.session.isAdmin = true;

    return res.redirect('/admin');
  }
  res.redirectBack();
};

module.exports.postLogout = (req, res) => {
  req.session.destroy();
  res.redirect('/login');
};
