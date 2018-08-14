const uuid = require('uuid');
const { db } = require('../../config');

const Group = {
  findAll: async (params) => {
    const query = ['SELECT id, name FROM groups'];
    if (params.per_page && params.page) {
      query.push(`LIMIT ${params.per_page} OFFSET ${(params.page - 1) * params.per_page}`);
    }
    const result = await db.query(query.join(' '));
    return result.rows;
  },
  findById: async (id) => {
    const result = await db.query('SELECT id, name FROM groups WHERE id = $1', [id]);
    return result.rows[0];
  },
  create: async (group) => {
    if (!group.id) group.id = uuid.v4();
    const result = await db.query('INSERT INTO groups(id, name) VALUES($1, $2) RETURNING *', [group.id, group.name]);
    return result.rows[0];
  },
  update: async (group) => {
    const now = new Date().toISOString();
    const result = await db.query('UPDATE groups SET (name, updated_at) VALUES($2, $3) WHERE id = $1 RETURNING *', [group.id, group.name, now]);
    return result.rows[0];
  },
};

module.exports = Group;
