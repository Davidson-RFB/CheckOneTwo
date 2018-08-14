const httperrors = require('httperrors');

module.exports = async (req, res, next) => {
  if (!req.user) {
    throw httperrors.Forbidden();
  }
  return next();
};
