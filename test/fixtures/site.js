const Site = require('../../src/models/site');
const bandname = require('bandname');
const fixtureFactory = require('./group');

module.exports = async () => {
  const fixture = await (await fixtureFactory()).instance();

  const data = {
    name: bandname(),
    group_id: fixture.id,
  };

  return {
    data,
    instance: async () => Site.create(data),
  };
};
