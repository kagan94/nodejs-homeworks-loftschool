const sequelize = require('../helpers/sequelize');
const setCookie = require('../helpers/set-cookie');
const decodeJwtToken = require('../helpers/decode-jwt-token');

module.exports.doLogin = async (req, res, next) => {
  const {username, password, remembered} = req.body;
  const user = await sequelize.models.user.findOne({where: {username: username}});
  console.log(JSON.stringify(user), username, req.body);

  if (!user) return res.status(400).send({error: 'User not found'});
  if (!user.isPasswordValid(password)) return res.status(400).send({error: 'Password is wrong'});

  const accessToken = user.encodeToken();
  await user.update({access_token: accessToken});
  req.session.accessToken = accessToken;

  // If remember_me was checked => save token to cookie
  if (remembered) {
    console.log('access token saved to cookie');
    setCookie(res, 'access_token', accessToken);
  }

  await res.send(user);
};

module.exports.authFromToken = async (req, res) => {
  let accessToken = req.body.access_token;

  // Received access token contains quotes "", that's why cut off them here
  accessToken = accessToken.substr(1, accessToken.length - 2);
  if (!accessToken) return res.status(400).send({error: 'Access token is not defined in cookie'});

  const decodedToken = decodeJwtToken(accessToken);
  if (!decodedToken) return res.status(400).send({error: 'Could not decode access token'});

  const user = await sequelize.models.user.findOne({where: {id: decodedToken.id}});
  if (!user) return res.status(400).send({error: 'User not found'});

  req.session.accessToken = accessToken;
  res.send(user);
};
