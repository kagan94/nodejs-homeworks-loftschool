/**
 * Created by Leo on 3/25/2018.
 */

module.exports = (res, cookieKey, data) => {
  res.cookie(cookieKey, data, {
    maxAge: ((((1000 * 60) * 60) * 24) * 7), // 7 days
    path: '/',
    httpOnly: true
  });
};
