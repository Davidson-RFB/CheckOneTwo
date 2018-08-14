const HttpError = require('httperrors');
const { logger } = require('../../config');

module.exports = (err, req, res, next) => {
  logger.error(err);

  if (err instanceof HttpError) {
    res.status(err.statusCode).json({ error: err.message });
  }

  const type = Object.toString.call(err.constructor);

  if (type.indexOf('ValidationError') !== -1) {
    res.status(400);
    if (err.dataPath) {
      res.json({ error: `${err.dataPath} ${err.message}` });
    } else {
      res.json({ error: err.message });
    }
  }

  next(err);
};
