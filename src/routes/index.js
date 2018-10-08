const { Router } = require('express');
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

router.use('/v1', v1);
