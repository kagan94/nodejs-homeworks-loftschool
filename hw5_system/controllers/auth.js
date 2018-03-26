const sequelize = require('../helpers/sequelize');
const setCookie = require('../helpers/set-cookie');
const decodeJwtToken = require('../helpers/decode-jwt-token');

module.exports.doLogin = async (req, res, next) => {
  const {email, password, remembered} = req.body;
  const user = await sequelize.models.user.findOne({email: email});

  if (!user) {
    return res.status(400).send({error: 'User not found'});
  } else if (!user.isPasswordValid(password)) {
    return res.status(400).send({error: 'Password is wrong'});
  }
  // console.log(JSON.stringify(user));

  const accessToken = user.encodeToken();
  await user.update({access_token: accessToken});
  req.session.accessToken = accessToken;
  req.session.save();

  // res.header('Access-Control-Allow-Credentials', 'true');

  console.log('after login', req.session.accessToken);

  // If remember_me was checked => save token to cookie
  if (remembered) {
    setCookie(res, 'access_token', accessToken);
  }

  await res.send(user);
};

module.exports.authFromToken = async (req, res) => {
  // const payload = req.body.access_token;
  console.log(req.body);

  const cookieToken = req.cookies['access_token'];
  if (!cookieToken) return res.status(400).send({error: 'Access token is not defined in cookie'});

  const decodedToken = decodeJwtToken(cookieToken);
  if (!decodedToken) return res.status(400).send({error: 'Could not decode access token'});

  const user = await sequelize.models.user.findOne({id: decodedToken.id});
  if (!user) return res.status(400).send({error: 'User not found'});

  res.send(user);
};
