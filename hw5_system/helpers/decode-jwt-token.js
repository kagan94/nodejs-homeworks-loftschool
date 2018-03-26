/**
 * Created by Leo on 3/25/2018.
 */

const config = require('../helpers/config');
const jwt = require('jwt-simple');

module.exports = (token) => {
  const decoded = jwt.decode(token, config.secretKey);
  return decoded;
};
