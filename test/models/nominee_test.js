const Nominee = require('../../src/models/nominee');
const fixtureFactory = require('../fixtures/nominee');

describe('nominee model', () => {
  let fixture;

  beforeEach('generate fixture', async () => {
    fixture = (await fixtureFactory()).data;
  });

  it('must return something', () => {
    expect(Nominee).to.exist();
  });

  it('must create a nominee', async () => {
    await Nominee.create(fixture);
  });

  it('must create a nominee with uuid ids', async () => {
    const uuidRegex = /^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-4[a-fA-F0-9]{3}-[89abAB][a-fA-F0-9]{3}-[a-fA-F0-9]{12}$/;
    const nominee = await Nominee.create(fixture);
    expect(nominee.id).to.match(uuidRegex);
  });

  it('must have timestamps', async () => {
    const nominee = await Nominee.create(fixture);
    expect(nominee.created_at).to.exist();
    expect(nominee.updated_at).to.exist();
  });
});
