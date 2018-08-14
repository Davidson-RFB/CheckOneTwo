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
];

re(environmentVariables);

environmentVariables.forEach((v) => {
  const variable = v.var || v;
  let inner = process.env[variable];
  if (inner === 'false') inner = false;
  if (inner === 'true') inner = true;
  module.exports[variable] = inner;
});
