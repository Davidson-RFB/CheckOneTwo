const config = require('../../config');
const User = require('../models/user');

module.exports = async (req, res, next) => {
  // You can use whatever auth strategy you like in here
  if (config.DISABLE_AUTH) return next();

  if (req.signedCookies.user) {
    const user = await User.findById(req.signedCookies.user);
    req.user = user; // eslint-disable-line no-param-reassign
  }

  return next();
};
