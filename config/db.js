const env = require('./env');
const { Client } = require('pg');

const client = new Client({
  connectionString: env.DATABASE_URI,
});

module.exports = client;
