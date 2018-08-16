const uuid = require('uuid');
const { db } = require('../../config');

const addUUIDs = (i) => {
  if (!i.uuid) i.uuid = uuid.v4();
  return i;
};

const Check = {
  findAll: async (params) => {
    const query = ['SELECT id, site_id, items, submitted_by FROM checks'];
    if (params.per_page && params.page) {
      query.push(`LIMIT ${params.per_page} OFFSET ${(params.page - 1) * params.per_page}`);
    }
    const result = await db.query(query.join(' '));
    return result.rows;
  },
  findById: async (id) => {
    const result = await db.query('SELECT id, site_id, items, submitted_by FROM checks WHERE id = $1', [id]);
    return result.rows[0];
  },
  create: async (check) => {
    if (!check.id) check.id = uuid.v4();
    const result = await db.query('INSERT INTO checks(id, site_id, items, submitted_by) VALUES($1, $2, $3, $4) RETURNING *', [check.id, check.site_id, JSON.stringify(check.items.map(addUUIDs)), check.submitted_by]);
    return result.rows[0];
  },
  update: async (check) => {
    const now = new Date().toISOString();
    const result = await db.query('UPDATE checks SET (site_id, items, submitted_by, updated_at) = ($2, $3, $4, $5) WHERE id = $1 RETURNING *', [check.id, check.site_id, JSON.stringify(check.items.map(addUUIDs)), check.submitted_by, now]);
    return result.rows[0];
  },
};

module.exports = Check;
