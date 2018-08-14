const { Router } = require('express');
const things = require('./things');

const v1 = new Router()
  .use('/things', things);

const router = module.exports = new Router();

router.use('/v1', v1);
