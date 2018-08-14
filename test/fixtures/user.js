const User = require('../../src/models/user');
const bandname = require('bandname');

module.exports = async () => {
  const data = {
    email: 'eo@example.com',
    name: bandname(),
  };

  return {
    data,
    instance: async () => User.create(data),
  };
};
