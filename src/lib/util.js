const { db, logger } = require('../../config');

const sleep = ms => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

const waitForDb = async () => {
  try {
    await db.connect();
    await db.query('SELECT NOW()');
  } catch (e) {
    logger.error(e, 'error connecting to db');
    logger.error('waiting for database connection to come up');
    await sleep(1000);
    return waitForDb();
  }
  return null;
};

module.exports = {
  sleep,
  waitForDb,
};
