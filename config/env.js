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
  {
    var: 'APP_URI',
    default: 'localhost',
  },
  {
    var: 'SALT_ROUNDS',
    default: '10',
  },
  {
    var: 'SMTP_HOST',
    default: 'smtp.ethereal.email',
  },
  {
    var: 'SMTP_PORT',
    default: '587',
  },
  {
    var: 'SMTP_SECURE',
    default: 'false',
  },
  {
    var: 'SMTP_USER',
    default: 'test',
  },
  {
    var: 'SMTP_PASS',
    default: 'test',
  },
  {
    var: 'EMAIL_FROM',
    default: 'checkonetwo@example.com',
  },
  {
    var: 'URI',
    default: 'http://localhost:3000',
  },
  {
    var: 'URI',
    default: 'http://localhost:3000',
  },
  'WHITELIST_DOMAIN',
  {
    var: 'JWT_SECRET',
    default: '1bd8685d-a630-45d3-bead-3e3de3d16903',
  },
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
