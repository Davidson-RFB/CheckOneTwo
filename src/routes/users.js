const { Router } = require('express');
const httperrors = require('httperrors');
const User = require('../models/user');
const pagination = require('../lib/pagination');
const demandUser = require('../middleware/demand_user');

module.exports = new Router()
  .use('', demandUser)
  .get('', async (req, res) => {
    const query = pagination(req.query);
    const results = await User.findAll(query);
    res.json(results);
  })
  .get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) throw httperrors.NotFound();

    res.json(user);
  })
  .post('', async (req, res) => {
    const payload = req.body;

    const created = await User.create(payload);

    res.json(created);
  });
