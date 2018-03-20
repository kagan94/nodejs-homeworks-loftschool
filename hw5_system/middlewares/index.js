/**
 * Created by Leo on 3/20/2018.
 */

module.exports.isUser = (req, res, next) => {

  // TODO: Add support of validation based on JWT token

  if (req.session && req.session.isUser) {
    return next();
  }
  res.status(401);
};
