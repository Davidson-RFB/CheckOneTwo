const uuid = require('uuid');
const { app } = require('../helper');
const FixtureFactory = require('../fixtures/nominee');

describe('/v1/nominees', () => {
  let fixture;

  before('create a nominee', async () => {
    fixture = await (await FixtureFactory()).instance();
  });

  describe('GET', () => {
    it('must return a 200', async () => {
      const response = await app.get('/v1/nominees');
      expect(response.status).to.equal(200);
    });

    it('must return an array', async () => {
      const response = await app.get('/v1/nominees');
      expect(Array.isArray(response.body)).to.be.true;
    });

    it('must return a nominee', async () => {
      const response = await app.get('/v1/nominees');
      expect(response.body.length).to.be.gt(0);
    });

    it('must limit nominees', async () => {
      const response = await app.get('/v1/nominees', { per_page: 2 });
      expect(response.body.length).to.equal(2);
    });
  });

  describe('GET/:id', () => {
    it('must get the right nominee', async () => {
      const response = await app.get(`/v1/nominees/${fixture.id}`);
      expect(response.body.id).to.equal(fixture.id);
    });

    it('must return 404 for a missing nominee', async () => {
      const response = await app.get(`/v1/nominees/${uuid.v4()}`);
      expect(response.status).to.equal(404);
    });
  });
});

describe('/v1/nominees', () => {
  let fixture;

  before('create a nominee', async () => {
    fixture = (await FixtureFactory()).data;
  });

  describe('POST', () => {
    it('must accept a valid body', async () => {
      const response = await app.post('/v1/nominees', fixture);
      expect(response.status).to.equal(200);
    });

    it('must return the persisted data', async () => {
      const response = await app.post('/v1/nominees', fixture);
      expect(response.body.name).to.eql(fixture.name);
      expect(response.body.email).to.eql(fixture.email);
    });

    it('must deny an unauthorised user', async () => {
      const response = await app.post('/v1/nominees', fixture, {
        Authorization: null,
      });
      expect(response.status).to.equal(401);
    });
  });
});
