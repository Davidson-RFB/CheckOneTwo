const Group = require('../../src/models/group');
const bandname = require('bandname');

module.exports = async () => {
  const data = {
    name: bandname(),
  };

  return {
    data,
    instance: async () => Group.create(data),
  };
};
