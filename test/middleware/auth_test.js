const { app, authHeader } = require('../helper');
const config = require('../../config');

describe('auth middleware', () => {
  it('must reject access attempts without credentials', async () => {
    const response = await app.get('/404', {}, { Authorization: '' });
    expect(response.status).to.equal(401);
    expect(response.body).to.eql({ error: 'Must provide both username and password' });
  });

  it('must reject access attempts without a username', async () => {
    const header = authHeader('', 'pass');
    const response = await app.get('/404', {}, { Authorization: header });
    expect(response.status).to.equal(401);
    expect(response.body).to.eql({ error: 'Must provide both username and password' });
  });

  it('must reject access attempts without a password', async () => {
    const header = authHeader('user', '');
    const response = await app.get('/404', {}, { Authorization: header });
    expect(response.status).to.equal(401);
    expect(response.body).to.eql({ error: 'Must provide both username and password' });
  });

  it('must deny access with incorrect credential', async () => {
    const header = authHeader('hacker', 'hackhackhack');
    const response = await app.get('/404', {}, { Authorization: header });
    expect(response.status).to.equal(403);
    expect(response.body).to.eql({ error: 'Incorrect credentials' });
  });

  it('must deny access with correct user and incorrect pass', async () => {
    const header = authHeader(config.AUTH_USER, 'hackhackhack');
    const response = await app.get('/404', {}, { Authorization: header });
    expect(response.status).to.equal(403);
    expect(response.body).to.eql({ error: 'Incorrect credentials' });
  });

  it('must deny access with incorrect user and correct pass', async () => {
    const header = authHeader('hacker', config.AUTH_PASS);
    const response = await app.get('/404', {}, { Authorization: header });
    expect(response.status).to.equal(403);
    expect(response.body).to.eql({ error: 'Incorrect credentials' });
  });

  it('must allow access with correct credential', async () => {
    const header = authHeader(config.AUTH_USER, config.AUTH_PASS);
    const response = await app.get('/404', {}, { Authorization: header });
    expect(response.status).to.equal(404);
  });
});
