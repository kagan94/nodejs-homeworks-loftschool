/**
 * Created by Leo on 3/10/2018.
 */

module.exports.isAdmin = (req, res, next) => {
  if (req.session && req.session.isAdmin) {
    return next();
  }
  req.addError('You are not logged in as Admin!');
  res.redirect('/login');
};
