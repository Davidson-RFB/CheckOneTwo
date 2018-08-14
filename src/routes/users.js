const { Router } = require('express');
const httperrors = require('httperrors');
const User = require('../models/user');
const pagination = require('../lib/pagination');
const demandUser = require('../middleware/demand_user');
const config = require('../../config');
const bcrypt = require('bcrypt');

module.exports = new Router()
  .post('/:id/send-login-token', async (req, res) => {
    const user = await User.findById(req.params.id);

    const salt = await bcrypt.genSalt(config.SALT_ROUNDS);
    const token = await bcrypt.hash(user.id + config.TOKEN_SECRET, salt);

    await config.mail.sendLoginToken(user.email, user.id, token);

    res.json({ ok: true });
  })
  .get('/:id/login', async (req, res) => {
    const user = await User.findById(req.params.id);

    const ok = await bcrypt.compare(user.id + config.TOKEN_SECRET, req.query.token);
    if (!ok) {
      throw httperrors.Unauthorized();
    }

    res.cookie('user', user.id, {
      maxAge: 900000,
      httpOnly: true,
      signed: true,
    });

    res.redirect(302, '/');
  })
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
