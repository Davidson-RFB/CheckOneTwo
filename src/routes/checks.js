const { Router } = require('express');
const httperrors = require('httperrors');
const Check = require('../models/check');
const pagination = require('../lib/pagination');

module.exports = new Router()
  .get('', async (req, res) => {
    const query = pagination(req.query);
    const results = await Check.findAll(query);
    res.json(results);
  })
  .get('/:id', async (req, res) => {
    const check = await Check.findById(req.params.id);

    if (!check) throw httperrors.NotFound();

    res.json(check);
  })
  .post('', async (req, res) => {
    const payload = req.body;

    const created = await Check.create(payload);

    res.json(created);
  });
