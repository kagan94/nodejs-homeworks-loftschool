/**
 * Created by Leo on 3/20/2018.
 */

const sequelize = require('../helpers/sequelize');
const decodeJwtToken = require('../helpers/decode-jwt-token');

module.exports.isAuthenticated = async function (req, res, next) {
  console.log(req.session, req.session.accessToken);
  if (!req.session || !req.session.accessToken) {
    return res.status(401).send();
  }

  const decodedToken = decodeJwtToken(req.session.accessToken);
  const user = await sequelize.models.user.findOne({id: decodedToken.id});
  if (!user) {
    return res.status(400).send({error: 'User not found'});
  }
  req.user = user;
  await next();
};
