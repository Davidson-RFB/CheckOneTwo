const uuid = require('uuid');
const { db } = require('../../config');

const Nominee = {
  findAll: async (params) => {
    const query = ['SELECT id, email FROM nominees'];
    if (params.per_page && params.page) {
      query.push(`LIMIT ${params.per_page} OFFSET ${(params.page - 1) * params.per_page}`);
    }
    const result = await db.query(query.join(' '));
    return result.rows;
  },
  findById: async (id) => {
    const result = await db.query('SELECT id, email FROM nominees WHERE id = $1', [id]);
    return result.rows[0];
  },
  create: async (nominee) => {
    if (!nominee.id) nominee.id = uuid.v4();
    const result = await db.query('INSERT INTO nominees(id, email) VALUES($1, $2) RETURNING *', [nominee.id, nominee.email]);
    return result.rows[0];
  },
  update: async (nominee) => {
    const now = new Date().toISOString();
    const result = await db.query('UPDATE nominees SET (email, updated_at) = ($2, $3) WHERE id = $1 RETURNING *', [nominee.id, nominee.email, now]);
    return result.rows[0];
  },
};

module.exports = Nominee;
