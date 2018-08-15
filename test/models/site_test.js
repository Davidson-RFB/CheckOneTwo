const Site = require('../../src/models/site');
const fixtureFactory = require('../fixtures/site');

describe('site model', () => {
  let fixture;

  beforeEach('generate fixture', async () => {
    fixture = (await fixtureFactory()).data;
  });

  it('must return something', () => {
    expect(Site).to.exist;
  });

  it('must create a site', async () => {
    await Site.create(fixture);
  });

  it('must create a site with uuid ids', async () => {
    const uuidRegex = /^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-4[a-fA-F0-9]{3}-[89abAB][a-fA-F0-9]{3}-[a-fA-F0-9]{12}$/;
    const site = await Site.create(fixture);
    expect(site.id).to.match(uuidRegex);
    expect(site.group_id).to.match(uuidRegex);
  });

  it('must have timestamps', async () => {
    const site = await Site.create(fixture);
    expect(site.created_at).to.exist;
    expect(site.updated_at).to.exist;
  });
});
