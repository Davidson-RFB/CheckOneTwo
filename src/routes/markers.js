const { Router } = require('express');
const httperrors = require('httperrors');
const Marker = require('../models/marker');
const pagination = require('../lib/pagination');

module.exports = new Router()
  .get('', async (req, res) => {
    const query = pagination(req.query);
    const results = await Marker.findAll(query);
    res.json(results);
  })
  .get('/:id', async (req, res) => {
    const marker = await Marker.findById(req.params.id);

    if (!marker) throw httperrors.NotFound();

    res.json(marker);
  })
  .post('', async (req, res) => {
    const payload = req.body;

    const created = await Marker.create(payload);

    res.json(created);
  })
  .delete('/:id', async (req, res) => {
    res.json(Marker.delete(req.params.id));
  });
