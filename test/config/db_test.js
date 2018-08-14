const { db } = require('../../config');

describe('database connection', () => {
  it('must connect', async () => {
    await db.query('SELECT NOW()');
  });
});
