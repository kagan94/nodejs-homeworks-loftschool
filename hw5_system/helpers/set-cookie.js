/**
 * Created by Leo on 3/25/2018.
 */

module.exports = (res, cookieKey, data) => {
  res.cookie(cookieKey, JSON.stringify(data), {
    expires: new Date(Date.now() + 2 * 604800000),
    path: '/'
  });
};
