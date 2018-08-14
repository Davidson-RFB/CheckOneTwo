const uuid = require('uuid');
const { app } = require('../helper');
const FixtureFactory = require('../fixtures/thing');

describe('/v1/things', () => {
  let fixture;

  before('create a thing', async () => {
    fixture = await (await FixtureFactory()).instance();
  });

  describe('GET', () => {
    it('must return a 200', async () => {
      const response = await app.get('/v1/things');
      expect(response.status).to.equal(200);
    });

    it('must return an array', async () => {
      const response = await app.get('/v1/things');
      expect(Array.isArray(response.body)).to.be.true;
    });

    it('must return a thing', async () => {
      const response = await app.get('/v1/things');
      expect(response.body.length).to.be.gt(0);
    });

    it('must limit things', async () => {
      const response = await app.get('/v1/things', { per_page: 2 });
      expect(response.body.length).to.equal(2);
    });
  });

  describe('GET/:id', () => {
    it('must get the right thing', async () => {
      const response = await app.get(`/v1/things/${fixture.id}`);
      expect(response.body.id).to.equal(fixture.id);
    });

    it('must return 404 for a missing thing', async () => {
      const response = await app.get(`/v1/things/${uuid.v4()}`);
      expect(response.status).to.equal(404);
    });
  });
});

describe('/v1/things', () => {
  let fixture;

  before('create a thing', async () => {
    fixture = (await FixtureFactory()).data;
  });

  describe('POST', () => {
    it('must accept a valid body', async () => {
      const response = await app.post('/v1/things', fixture);
      expect(response.status).to.equal(200);
    });

    it('must return the persisted data', async () => {
      const response = await app.post('/v1/things', fixture);
      expect(response.body.name).to.eql(fixture.name);
      expect(response.body.email).to.eql(fixture.email);
    });
  });
});
