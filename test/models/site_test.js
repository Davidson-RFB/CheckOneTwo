const Site = require('../../src/models/site');
const Check = require('../../src/models/check');
const fixtureFactory = require('../fixtures/site');
const checkFixtureFactory = require('../fixtures/check');

describe('site model', () => {
  let fixture;

  beforeEach('generate fixture', async () => {
    fixture = (await fixtureFactory()).data;
  });

  it('must return something', () => {
    expect(Site).to.exist();
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
    expect(site.created_at).to.exist();
    expect(site.updated_at).to.exist();
  });

  it('must have an items array', async () => {
    const site = await Site.create(fixture);
    expect(Array.isArray(site.items)).to.be.true();
    expect(site.items).to.eql(fixture.items);
  });

  it('must contain the last checked at timestamp', async () => {
    const site = await Site.create(fixture);

    const oldCheck = (await checkFixtureFactory()).data;
    oldCheck.site_id = site.id;
    await Check.create(oldCheck);

    const check = (await checkFixtureFactory()).data;
    check.site_id = site.id;
    await Check.create(check);
    const found = (await Site.findAll({ by_group: site.group_id }))[0];
    expect(found.last_checked_at).to.exist();
    expect(found.last_checked_by).to.equal(check.submitted_by);
  });

  it('must return group sites', async () => {
    const site = await Site.create(fixture);
    const found = await Site.findAll({ by_group: site.group_id });
    expect(found.length).to.equal(1);
  });

  describe('create', () => {
    it('must give items a uuid', async () => {
      fixture.items = fixture.items.map((i) => {
        delete i.uuid; // eslint-disable-line no-param-reassign
        return i;
      });
      const site = await Site.create(fixture);
      site.items.forEach((i) => {
        if (!i) return;
        expect(i.uuid).to.exist();
      });
    });
  });

  describe('update', () => {
    it('must give items a uuid', async () => {
      fixture.items = fixture.items.map((i) => {
        delete i.uuid; // eslint-disable-line no-param-reassign
        return i;
      });
      await Site.create(fixture);
      const site = await Site.update(fixture);
      site.items.forEach((i) => {
        if (!i) return;
        expect(i.uuid).to.exist();
      });
    });
  });
});
