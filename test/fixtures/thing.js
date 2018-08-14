const Thing = require('../../src/models/thing');
const bandname = require('bandname');

module.exports = async () => {
  const data = {
    quantity: 50,
    description: 'Bag of coffee',
    name: bandname(),
  };

  return {
    data,
    instance: async () => Thing.create(data),
  };
};
