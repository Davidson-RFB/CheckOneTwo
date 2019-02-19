const re = require('required_env');

const environmentVariables = [
  {
    var: 'PORT',
    default: '3000',
  },
  {
    var: 'LOG_LEVEL',
    default: 'debug',
  },
  'AUTH_USER',
  'AUTH_PASS',
  'DISABLE_AUTH',
  'DATABASE_URI',
  'COOKIE_SECRET',
  'TOKEN_SECRET',
  'APP_URI',
  {
    var: 'SALT_ROUNDS',
    default: '10',
  },
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_SECURE',
  'SMTP_USER',
  'SMTP_PASS',
  'EMAIL_FROM',
  'URI',
  'WHITELIST_DOMAIN',
  'JWT_SECRET',
];

re(environmentVariables);

environmentVariables.forEach((v) => {
  const variable = v.var || v;
  let inner = process.env[variable];
  if (inner === 'false') inner = false;
  if (inner === 'true') inner = true;
  module.exports[variable] = inner;
});

module.exports.SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS, 10);
