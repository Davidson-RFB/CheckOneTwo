const Check = require('../../src/models/check');
const bandname = require('bandname');
const fixtureFactory = require('./site');

module.exports = async () => {
  const fixture = await (await fixtureFactory()).instance();

  const data = {
    site_id: fixture.id,
    items: [
      {
        notes: bandname(),
        status: 'pass',
      },
    ],
  };

  return {
    data,
    instance: async () => Check.create(data),
  };
};
