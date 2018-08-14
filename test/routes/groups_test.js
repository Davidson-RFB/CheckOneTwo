const uuid = require('uuid');
const { app } = require('../helper');
const FixtureFactory = require('../fixtures/group');

describe('/v1/groups', () => {
  let fixture;

  before('create a group', async () => {
    fixture = await (await FixtureFactory()).instance();
  });

  describe('GET', () => {
    it('must return a 200', async () => {
      const response = await app.get('/v1/groups');
      expect(response.status).to.equal(200);
    });

    it('must return an array', async () => {
      const response = await app.get('/v1/groups');
      expect(Array.isArray(response.body)).to.be.true;
    });

    it('must return a group', async () => {
      const response = await app.get('/v1/groups');
      expect(response.body.length).to.be.gt(0);
    });

    it('must limit groups', async () => {
      const response = await app.get('/v1/groups', { per_page: 2 });
      expect(response.body.length).to.equal(2);
    });

    it('must deny an unauthorised user', async () => {
      const response = await app.get('/v1/groups', {}, {
        Cookie: null,
      });
      expect(response.status).to.equal(403);
    });
  });

  describe('GET/:id', () => {
    it('must get the right group', async () => {
      const response = await app.get(`/v1/groups/${fixture.id}`);
      expect(response.body.id).to.equal(fixture.id);
    });

    it('must return 404 for a missing group', async () => {
      const response = await app.get(`/v1/groups/${uuid.v4()}`);
      expect(response.status).to.equal(404);
    });

    it('must deny an unauthorised user', async () => {
      const response = await app.get(`/v1/groups/${uuid.v4()}`, {}, {
        Cookie: null,
      });
      expect(response.status).to.equal(403);
    });
  });
});

describe('/v1/groups', () => {
  let fixture;

  before('create a group', async () => {
    fixture = (await FixtureFactory()).data;
  });

  describe('POST', () => {
    it('must accept a valid body', async () => {
      const response = await app.post('/v1/groups', fixture);
      expect(response.status).to.equal(200);
    });

    it('must return the persisted data', async () => {
      const response = await app.post('/v1/groups', fixture);
      expect(response.body.name).to.eql(fixture.name);
      expect(response.body.email).to.eql(fixture.email);
    });

    it('must deny an unauthorised user', async () => {
      const response = await app.post('/v1/groups', fixture, {
        Cookie: null,
      });
      expect(response.status).to.equal(403);
    });
  });
});
