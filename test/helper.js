const must = require('must');
const config = require('../config');
const { waitForDb } = require('../src/lib/util');

global.expect = must; // https://www.npmjs.com/package/must#asserting-on-property-access

const app = require('../src/index');
const doubleagent = require('doubleagent');

function authHeader(user, pass) {
  const encoded = new Buffer(`${user}:${pass}`).toString('base64');
  return `Basic ${encoded}`;
}

const doubleApp = doubleagent(app);
doubleApp.defaultHeaders = { Authorization: authHeader(config.AUTH_USER, config.AUTH_PASS) };

process.nextTick(() => {
  before('wait for db connection', async () => waitForDb());
});

module.exports = {
  app: doubleApp,
  authHeader,
};
