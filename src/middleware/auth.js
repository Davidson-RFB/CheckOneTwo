const basicAuth = require('basic-auth');
const httpErrors = require('httperrors');
const config = require('../../config');

module.exports = (req, res, next) => {
  // You can use whatever auth strategy you like in here
  if (config.DISABLE_AUTH) return next();

  const auth = basicAuth(req);
  if (!auth || !auth.name || !auth.pass) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Secure API"');
    throw httpErrors.Unauthorized('Must provide both username and password');
  }
  if (auth.name !== config.AUTH_USER || auth.pass !== config.AUTH_PASS) {
    throw httpErrors.Forbidden('Incorrect credentials');
  }
  return next();
};
