const User = require('../../src/models/user');
const fixtureFactory = require('../fixtures/user');

describe('user model', () => {
  let fixture;

  beforeEach('generate fixture', async () => {
    fixture = (await fixtureFactory()).data;
  });

  it('must return something', () => {
    expect(User).to.exist;
  });

  it('must create a user', async () => {
    await User.create(fixture);
  });

  it('must create a user with uuid ids', async () => {
    const uuidRegex = /^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-4[a-fA-F0-9]{3}-[89abAB][a-fA-F0-9]{3}-[a-fA-F0-9]{12}$/;
    const user = await User.create(fixture);
    expect(user.id).to.match(uuidRegex);
  });

  it('must have timestamps', async () => {
    const user = await User.create(fixture);
    expect(user.created_at).to.exist;
    expect(user.updated_at).to.exist;
  });
});
