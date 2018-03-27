/**
 * Created by Leo on 3/20/2018.
 */

const sequelize = require('../helpers/sequelize');
const decodeJwtToken = require('../helpers/decode-jwt-token');

module.exports.AuthMiddleware = async function (req, res, next) {
  const accessToken = req.session ? req.session.accessToken : null;
  if (!accessToken) return res.status(400).send({error: 'Access token is not defined in cookie'});

  const decodedToken = decodeJwtToken(accessToken);
  const user = await sequelize.models.user.findOne({where: {id: decodedToken.id}});
  if (!user) return res.status(400).send({error: 'User not found'});

  req.user = user;
  await next();
};
