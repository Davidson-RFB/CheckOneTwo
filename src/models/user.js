const uuid = require('uuid');
const { db } = require('../../config');

const User = {
  findAll: async (params) => {
    const query = ['SELECT id, email, name FROM users'];
    if (params.per_page && params.page) {
      query.push(`LIMIT ${params.per_page} OFFSET ${(params.page - 1) * params.per_page}`);
    }
    const result = await db.query(query.join(' '));
    return result.rows;
  },
  findById: async (id) => {
    const result = await db.query('SELECT id, email, name FROM users WHERE id = $1', [id]);
    return result.rows[0];
  },
  create: async (user) => {
    if (!user.id) user.id = uuid.v4();
    const result = await db.query('INSERT INTO users(id, email, name) VALUES($1, $2, $3) RETURNING *', [user.id, user.email, user.name]);
    return result.rows[0];
  },
  update: async (user) => {
    const now = new Date().toISOString();
    const result = await db.query('UPDATE users SET (email, name, updated_at) VALUES($2, $3, $4) WHERE id = $1 RETURNING *', [user.id, user.email, user.name, now]);
    return result.rows[0];
  },
};

module.exports = User;
