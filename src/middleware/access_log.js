/* eslint no-underscore-dangle: ["error", { "allow": ["_header"] }]*/

const logger = require('../../config/logger');

module.exports = (req, res, next) => {
  // This doesn't fire the log immediately, but waits until the response is finished
  // This means we have a chance of logging the response code
  res.on('finish', () => {
    logger.info({
      remoteAddress: req.ip,
      method: req.method,
      url: req.originalUrl,
      protocol: req.protocol,
      hostname: req.hostname,
      httpVersion: `${req.httpVersionMajor}.${req.httpVersionMinor}`,
      userAgent: req.headers['user-agent'],
      status: res._header ? res.statusCode : undefined,
    }, 'access_log');
  });
  next();
};
