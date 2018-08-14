const Group = require('../../src/models/group');
const fixtureFactory = require('../fixtures/group');

describe('group model', () => {
  let fixture;

  beforeEach('generate fixture', async () => {
    fixture = (await fixtureFactory()).data;
  });

  it('must return something', () => {
    expect(Group).to.exist;
  });

  it('must create a group', async () => {
    await Group.create(fixture);
  });

  it('must create a group with uuid ids', async () => {
    const uuidRegex = /^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-4[a-fA-F0-9]{3}-[89abAB][a-fA-F0-9]{3}-[a-fA-F0-9]{12}$/;
    const group = await Group.create(fixture);
    expect(group.id).to.match(uuidRegex);
  });

  it('must have timestamps', async () => {
    const group = await Group.create(fixture);
    expect(group.created_at).to.exist;
    expect(group.updated_at).to.exist;
  });
});
