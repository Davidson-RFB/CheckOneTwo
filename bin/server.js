const app = require('../src/index');
const server = require('http').createServer(app);
const log = require('../config').logger;
const { PORT } = require('../config');
const { waitForDb } = require('../src/lib/util');

waitForDb().then(() => {
  server.listen(PORT, () => {
    const { address, port } = server.address();
    log.info('Ordermentum Boilerplate API listening at http://%s:%s', address, port);
  });
});

process.on('unhandledRejection', (reason, p) => {
  log.error({ data: p }, 'Unhandled Promise Rejection', 'reason:', reason);
});
