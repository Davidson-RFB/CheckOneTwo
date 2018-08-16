const Nominee = require('../../src/models/nominee');
const bandname = require('bandname');

module.exports = async () => {
  const data = {
    email: `${bandname().replace(' ', '_')}@example.com`,
  };

  return {
    data,
    instance: async () => Nominee.create(data),
  };
};
