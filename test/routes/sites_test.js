const uuid = require('uuid');
const { app } = require('../helper');
const FixtureFactory = require('../fixtures/site');

describe('/v1/sites', () => {
  let fixture;

  before('create a site', async () => {
    fixture = await (await FixtureFactory()).instance();
  });

  describe('GET', () => {
    it('must return a 200', async () => {
      const response = await app.get('/v1/sites');
      expect(response.status).to.equal(200);
    });

    it('must return an array', async () => {
      const response = await app.get('/v1/sites');
      expect(Array.isArray(response.body)).to.be.true;
    });

    it('must return a site', async () => {
      const response = await app.get('/v1/sites');
      expect(response.body.length).to.be.gt(0);
    });

    it('must limit sites', async () => {
      const response = await app.get('/v1/sites', { per_page: 2 });
      expect(response.body.length).to.equal(2);
    });

    it('must search group sites', async () => {
      const newFixture = await (await FixtureFactory()).instance();

      const response = await app.get('/v1/sites', { by_group: newFixture.group_id });
      expect(response.body.length).to.equal(1);
    });

    it('must deny an unauthorised user', async () => {
      const response = await app.get('/v1/sites', {}, {
        Cookie: null,
      });
      expect(response.status).to.equal(403);
    });
  });

  describe('GET/:id', () => {
    it('must get the right site', async () => {
      const response = await app.get(`/v1/sites/${fixture.id}`);
      expect(response.body.id).to.equal(fixture.id);
    });

    it('must return 404 for a missing site', async () => {
      const response = await app.get(`/v1/sites/${uuid.v4()}`);
      expect(response.status).to.equal(404);
    });

    it('must deny an unauthorised user', async () => {
      const response = await app.get(`/v1/sites/${uuid.v4()}`, {}, {
        Cookie: null,
      });
      expect(response.status).to.equal(403);
    });
  });
});

describe('/v1/sites', () => {
  let fixture;

  before('create a site', async () => {
    fixture = (await FixtureFactory()).data;
  });

  describe('POST', () => {
    it('must accept a valid body', async () => {
      const response = await app.post('/v1/sites', fixture);
      expect(response.status).to.equal(200);
    });

    it('must return the persisted data', async () => {
      const response = await app.post('/v1/sites', fixture);
      expect(response.body.name).to.eql(fixture.name);
      expect(response.body.email).to.eql(fixture.email);
    });

    it('must deny an unauthorised user', async () => {
      const response = await app.post('/v1/sites', fixture, {
        Cookie: null,
      });
      expect(response.status).to.equal(403);
    });
  });
});
