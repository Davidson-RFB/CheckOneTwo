const uuid = require('uuid');
const { authedApp } = require('../helper');
const FixtureFactory = require('../fixtures/user');

describe('/v1/users', () => {
  let fixture;

  before('create a user', async () => {
    fixture = await (await FixtureFactory()).instance();
  });

  describe('GET', () => {
    it('must return a 200', async () => {
      const response = await authedApp.get('/v1/users');
      expect(response.status).to.equal(200);
    });

    it('must return an array', async () => {
      const response = await authedApp.get('/v1/users');
      expect(Array.isArray(response.body)).to.be.true;
    });

    it('must return a user', async () => {
      const response = await authedApp.get('/v1/users');
      expect(response.body.length).to.be.gt(0);
    });

    it('must limit users', async () => {
      const response = await authedApp.get('/v1/users', { per_page: 2 });
      expect(response.body.length).to.equal(2);
    });

    it('must deny an unauthorised user', async () => {
      const response = await authedApp.get('/v1/users', {}, {
        Cookie: null,
      });
      expect(response.status).to.equal(403);
    });
  });

  describe('GET/:id', () => {
    it('must get the right user', async () => {
      const response = await authedApp.get(`/v1/users/${fixture.id}`);
      expect(response.body.id).to.equal(fixture.id);
    });

    it('must return 404 for a missing user', async () => {
      const response = await authedApp.get(`/v1/users/${uuid.v4()}`);
      expect(response.status).to.equal(404);
    });

    it('must deny an unauthorised user', async () => {
      const response = await authedApp.get(`/v1/users/${uuid.v4()}`, {}, {
        Cookie: null,
      });
      expect(response.status).to.equal(403);
    });
  });
});

describe('/v1/users', () => {
  let fixture;

  before('create a user', async () => {
    fixture = (await FixtureFactory()).data;
  });

  describe('POST', () => {
    it('must accept a valid body', async () => {
      const response = await authedApp.post('/v1/users', fixture);
      expect(response.status).to.equal(200);
    });

    it('must return the persisted data', async () => {
      const response = await authedApp.post('/v1/users', fixture);
      expect(response.body.name).to.eql(fixture.name);
      expect(response.body.email).to.eql(fixture.email);
    });

    it('must deny an unauthorised user', async () => {
      const response = await authedApp.post('/v1/users', fixture, {
        Cookie: null,
      });
      expect(response.status).to.equal(403);
    });
  });
});
