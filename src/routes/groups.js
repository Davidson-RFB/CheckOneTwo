const { Router } = require('express');
const httperrors = require('httperrors');
const Group = require('../models/group');
const pagination = require('../lib/pagination');
const demandUser = require('../middleware/demand_user');

module.exports = new Router()
  .get('', async (req, res) => {
    const query = pagination(req.query);
    const results = await Group.findAll(query);
    res.json(results);
  })
  .get('/:id', async (req, res) => {
    const group = await Group.findById(req.params.id);

    if (!group) throw httperrors.NotFound();

    res.json(group);
  })
  .use('', demandUser)
  .post('', async (req, res) => {
    const payload = req.body;

    const created = await Group.create(payload);

    res.json(created);
  });
