const { Router } = require('express');
const users = require('./users');
const groups = require('./groups');
const things = require('./things');

const v1 = new Router()
  .use('/users', users)
  .use('/groups', groups)
  .use('/things', things);

const router = module.exports = new Router();

router.use('/v1', v1);
