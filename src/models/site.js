const uuid = require('uuid');
const { db } = require('../../config');

const Site = {
  findAll: async (params) => {
    const query = ['SELECT id, group_id, name FROM sites'];
    if (params.per_page && params.page) {
      query.push(`LIMIT ${params.per_page} OFFSET ${(params.page - 1) * params.per_page}`);
    }
    const result = await db.query(query.join(' '));
    return result.rows;
  },
  findById: async (id) => {
    const result = await db.query('SELECT id, group_id, name FROM sites WHERE id = $1', [id]);
    return result.rows[0];
  },
  create: async (site) => {
    if (!site.id) site.id = uuid.v4();
    const result = await db.query('INSERT INTO sites(id, group_id, name) VALUES($1, $2, $3) RETURNING *', [site.id, site.group_id, site.name]);
    return result.rows[0];
  },
  update: async (site) => {
    const now = new Date().toISOString();
    const result = await db.query('UPDATE sites SET (group_id, name, updated_at) VALUES($2, $3, $4) WHERE id = $1 RETURNING *', [site.id, site.group_id, site.name, now]);
    return result.rows[0];
  },
};

module.exports = Site;
