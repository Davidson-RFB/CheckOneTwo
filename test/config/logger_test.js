const { logger } = require('../../config');

describe('logger', () => {
  it('must not blow up', async () => {
    logger.info('hello world');
  });
});
