const uuid = require('uuid');
const { db } = require('../../config');

const Thing = {
  findAll: async (params) => {
    const query = ['SELECT id, quantity, description, name FROM things'];
    if (params.per_page && params.page) {
      query.push(`LIMIT ${params.per_page} OFFSET ${(params.page - 1) * params.per_page}`);
    }
    const result = await db.query(query.join(' '));
    return result.rows;
  },
  findById: async (id) => {
    const result = await db.query('SELECT id, quantity, description, name FROM things WHERE id = $1', [id]);
    return result.rows[0];
  },
  create: async (thing) => {
    if (!thing.id) thing.id = uuid.v4();
    const result = await db.query('INSERT INTO things(id, quantity, description, name) VALUES($1, $2, $3, $4) RETURNING *', [thing.id, thing.quantity, thing.description, thing.name]);
    return result.rows[0];
  },
  update: async (thing) => {
    const now = new Date().toISOString();
    const result = await db.query('UPDATE things SET (quantity, description, name, updated_at) VALUES($2, $3, $4, $5) WHERE id = $1 RETURNING *', [thing.id, thing.quantity, thing.description, thing.name, now]);
    return result.rows[0];
  },
};

module.exports = Thing;
