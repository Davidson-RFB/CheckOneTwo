const must = require('must');
const config = require('../config');
const { waitForDb } = require('../src/lib/util');
const FixtureFactory = require('./fixtures/user');
const User = require('../src/models/user');

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
  before('create a user', async () => {
    let fixture = (await FixtureFactory()).data;
    fixture.id = 'aaa64479-a9b8-46fc-805a-18f8fd03e049';
    try {
      fixture = await User.create(fixture);
    } catch (e) {
      fixture = await User.findById(fixture.id);
    }
  });
});

const authedApp = () => {
  const agent = doubleagent(app);
  agent.defaultHeaders = {
    Cookie: 'user=s%3Aaaa64479-a9b8-46fc-805a-18f8fd03e049.eb18WHNsTKaTMwsiLqv15dEywWEMcVM1LCXGhp9vtA8',
  };
  return agent;
};

module.exports = {
  authedApp: authedApp(),
  app: doubleApp,
  authHeader,
};
