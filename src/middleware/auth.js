const config = require('../../config');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  // You can use whatever auth strategy you like in here
  if (config.DISABLE_AUTH) return next();

  const header = req.get('Authorization');

  if (!header) return next();

  const rawtoken = header.split(' ')[1];

  let userID;

  try {
    userID = await new Promise(async (resolve, reject) => {
      jwt.verify(rawtoken, config.JWT_SECRET, (err, token) => {
        if (err) return reject(err);
        return resolve(token.data.userID);
      });
    });
  } catch (e) {
    return next();
  }

  const user = await User.findById(userID);
  req.user = user; // eslint-disable-line no-param-reassign

  return next();
};
