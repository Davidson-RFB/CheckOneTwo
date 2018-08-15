const { Router } = require('express');
const httperrors = require('httperrors');
const Site = require('../models/site');
const pagination = require('../lib/pagination');
const demandUser = require('../middleware/demand_user');

module.exports = new Router()
  .use('', demandUser)
  .get('', async (req, res) => {
    const query = pagination(req.query);
    const results = await Site.findAll(query);
    res.json(results);
  })
  .get('/:id', async (req, res) => {
    const site = await Site.findById(req.params.id);

    if (!site) throw httperrors.NotFound();

    res.json(site);
  })
  .post('', async (req, res) => {
    const payload = req.body;

    const created = await Site.create(payload);

    res.json(created);
  });
