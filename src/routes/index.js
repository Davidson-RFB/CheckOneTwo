const { Router } = require('express');
const express = require('express');
const users = require('./users');
const groups = require('./groups');
const sites = require('./sites');
const checks = require('./checks');
const nominees = require('./nominees');
const markers = require('./markers');
const things = require('./things');

const v1 = new Router()
  .use('/users', users)
  .use('/groups', groups)
  .use('/sites', sites)
  .use('/checks', checks)
  .use('/nominees', nominees)
  .use('/markers', markers)
  .use('/things', things);

const router = module.exports = new Router();

router.get('/health', (req, res) => {
  res.send('ok');
});

router.use('/v1', v1);
router.use(express.static('./frontend/build'))
router.use('*', express.static('./frontend/build/index.html'))
