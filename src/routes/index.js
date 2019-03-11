const { Router } = require('express');
const express = require('express');

const v1 = new Router()
  .use('/users', require('./users'))
  .use('/groups', require('./groups'))
  .use('/sites', require('./sites'))
  .use('/checks', require('./checks'))
  .use('/nominees', require('./nominees'))
  .use('/markers', require('./markers'))
  .use('/things', require('./things'));

const router = module.exports = new Router();

router.get('/health', async (req, res) => {
  await db.query('SELECT NOW()');
  res.send('ok');
});

router.use('/v1', v1);
router.use(express.static('./frontend/build'));
router.use('*', express.static('./frontend/build/index.html'));
