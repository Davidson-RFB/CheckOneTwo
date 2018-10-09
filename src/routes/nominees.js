const { Router } = require('express');
const httperrors = require('httperrors');
const Nominee = require('../models/nominee');
const pagination = require('../lib/pagination');
const demandUser = require('../middleware/demand_user');

module.exports = new Router()
  .get('', async (req, res) => {
    const query = pagination(req.query);
    const results = await Nominee.findAll(query);
    res.json(results);
  })
  .get('/:id', async (req, res) => {
    const nominee = await Nominee.findById(req.params.id);

    if (!nominee) throw httperrors.NotFound();

    res.json(nominee);
  })
  .use('', demandUser)
  .post('', async (req, res) => {
    const payload = req.body;

    const created = await Nominee.create(payload);

    res.json(created);
  });
