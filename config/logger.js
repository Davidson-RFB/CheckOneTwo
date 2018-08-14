const env = require('./env');
const bunyan = require('bunyan');

module.exports = bunyan.createLogger({
  name: 'Boilerplate',
  environment: env.NODE_ENV,
  level: env.LOG_LEVEL,
  streams: [
    {
      stream: process.stdout,
    },
  ],
});
