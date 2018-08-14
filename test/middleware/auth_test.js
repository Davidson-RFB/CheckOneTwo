const { app } = require('../helper');

describe('user auth middleware', () => {
  it('must allow access with a valid user', async () => {
    const response = await app.get('/v1/users');
    expect(response.status).to.equal(200);
  });
  it('must deny access with a invalid user', async () => {
    const response = await app.get('/v1/users', {}, {
      Cookie: 'user=hackhackhack',
    });
    expect(response.status).to.equal(403);
  });
});
