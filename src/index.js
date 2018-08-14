const config = require('../config');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
require('express-async-errors');
const routes = require('./routes');
const { accessLog, httpErrors, auth } = require('./middleware');

const app = express();

app.use(accessLog);

app.use(cookieParser(config.COOKIE_SECRET));
app.use(auth);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(routes);

app.use(httpErrors);

module.exports = app;
