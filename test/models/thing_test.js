const Thing = require('../../src/models/thing');
const fixtureFactory = require('../fixtures/thing');

describe('thing model', () => {
  let fixture;

  beforeEach('generate fixture', async () => {
    fixture = (await fixtureFactory()).data;
  });

  it('must return something', () => {
    expect(Thing).to.exist;
  });

  it('must create a thing', async () => {
    await Thing.create(fixture);
  });

  it('must create a thing with uuid ids', async () => {
    const uuidRegex = /^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-4[a-fA-F0-9]{3}-[89abAB][a-fA-F0-9]{3}-[a-fA-F0-9]{12}$/;
    const thing = await Thing.create(fixture);
    expect(thing.id).to.match(uuidRegex);
  });

  it('must have timestamps', async () => {
    const thing = await Thing.create(fixture);
    expect(thing.created_at).to.exist;
    expect(thing.updated_at).to.exist;
  });
});
