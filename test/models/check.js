const Check = require('../../src/models/check');
const fixtureFactory = require('../fixtures/check');

describe('check model', () => {
  let fixture;

  beforeEach('generate fixture', async () => {
    fixture = (await fixtureFactory()).data;
  });

  it('must return something', () => {
    expect(Check).to.exist();
  });

  it('must create a check', async () => {
    await Check.create(fixture);
  });

  it('must create a check with uuid ids', async () => {
    const uuidRegex = /^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-4[a-fA-F0-9]{3}-[89abAB][a-fA-F0-9]{3}-[a-fA-F0-9]{12}$/;
    const check = await Check.create(fixture);
    expect(check.id).to.match(uuidRegex);
    expect(check.site_id).to.match(uuidRegex);
  });

  it('must have timestamps', async () => {
    const check = await Check.create(fixture);
    expect(check.created_at).to.exist();
    expect(check.updated_at).to.exist();
  });

  it('must have an items array', async () => {
    const check = await Check.create(fixture);
    expect(Array.isArray(check.items)).to.be.true();
    expect(check.items).to.eql(fixture.items);
  });
});
