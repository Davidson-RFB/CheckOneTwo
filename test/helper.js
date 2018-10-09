const must = require('must');
const { waitForDb } = require('../src/lib/util');
const FixtureFactory = require('./fixtures/user');
const User = require('../src/models/user');
const { db } = require('../config');
const jwt = require('jsonwebtoken');
const config = require('../config');

global.expect = must; // https://www.npmjs.com/package/must#asserting-on-property-access

const app = require('../src/index');
const doubleagent = require('doubleagent');

function authHeader(user, pass) {
  const encoded = new Buffer(`${user}:${pass}`).toString('base64');
  return `Basic ${encoded}`;
}

const token = jwt.sign({
  data: {
    userID: 'aaa64479-a9b8-46fc-805a-18f8fd03e049',
  },
}, config.JWT_SECRET);

const doubleApp = doubleagent(app);
doubleApp.defaultHeaders = {
  Authorization: `Token ${token}`,
};

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
  after('clear db', async () => {
    await db.query('TRUNCATE markers, checks, groups, nominees, sites, users, things');
  });
});

module.exports = {
  app: doubleApp,
  authHeader,
};
