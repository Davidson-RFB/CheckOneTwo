const { Router } = require('express');
const httperrors = require('httperrors');
const User = require('../models/user');
const pagination = require('../lib/pagination');
const demandUser = require('../middleware/demand_user');
const config = require('../../config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = new Router()
  .post('/:email/send-login-token', async (req, res) => {
    const parts = req.params.email.split('@');
    const domain = parts[1];
    const username = parts[0];

    let user = await User.findByColumn('email', req.params.email)[0];
    if (!user) {
      if (domain === config.WHITELIST_DOMAIN) {
        user = await User.create({
          email: req.params.email,
          name: username,
        });
      } else {
        throw httperrors.NotFound("That email domain is not whitelisted and there is no user account created for your address.");
      }
    }

    const salt = await bcrypt.genSalt(config.SALT_ROUNDS);
    const token = await bcrypt.hash(user.id + config.TOKEN_SECRET, salt);

    const message = await config.mail.sendLoginToken(user.email, user.id, token);

    res.json(message);
  })
  .get('/:id/login', async (req, res) => {
    const user = await User.findById(req.params.id);

    const ok = await bcrypt.compare(user.id + config.TOKEN_SECRET, req.query.token);
    if (!ok) {
      throw httperrors.Unauthorized();
    }

    const token = jwt.sign({
      data: {
        userID: user.id,
      },
    }, config.JWT_SECRET);

    res.json(token);
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
