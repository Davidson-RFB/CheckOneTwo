const Check = require('../../src/models/check');
const bandname = require('bandname');
const uuid = require('uuid');
const fixtureFactory = require('./site');

module.exports = async () => {
  const fixture = await (await fixtureFactory()).instance();

  const data = {
    site_id: fixture.id,
    submitted_by: bandname(),
    items: [
      {
        id: uuid.v4(),
        name: bandname(),
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
