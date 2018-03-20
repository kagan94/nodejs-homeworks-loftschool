const sequelize = require('../helpers/sequelize');

module.exports.doLogin = async (req, res) => {
  const {email, password} = req.body;
  const user = await sequelize.models.user.find({email: email});

  if (!user) {
    return res.status(400).send('User not found');
  } else if (user.password !== password) {
    return res.status(400).send('Password is wrong');
  }

  // TODO: Check hash of user password
  // TODO: genereate payload
  const payload = 'sdasdasdasda1231dcasdas';

  res.send(payload);
};

module.exports.authFromToken = (req, res) => {
  const payload = req.body.access_token;
  const user = {username: 'test@test.com', password: '123456'};

  // TODO: Check validity of user
  console.log(payload);

  res.send(payload);
};
