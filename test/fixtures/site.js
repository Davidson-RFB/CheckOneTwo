const Site = require('../../src/models/site');
const bandname = require('bandname');
const uuid = require('uuid');
const fixtureFactory = require('./group');

module.exports = async () => {
  const fixture = await (await fixtureFactory()).instance();

  const data = {
    name: bandname(),
    group_id: fixture.id,
    items: [
      {
        id: uuid.v4(),
        name: bandname(),
        quantity: 1,
        notes: bandname(),
      },
    ],
  };

  return {
    data,
    instance: async () => Site.create(data),
  };
};
