const Nominee = require('../../src/models/nominee');
const bandname = require('bandname');

module.exports = async () => {
  const data = {
    email: bandname(),
  };

  return {
    data,
    instance: async () => Nominee.create(data),
  };
};
