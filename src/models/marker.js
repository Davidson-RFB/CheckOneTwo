const uuid = require('uuid');
const { db } = require('../../config');

const reap = async () => {
  await db.query('DELETE FROM markers WHERE created_at < (NOW() - (INTERVAL \'60 MINUTE\'))');
};

const Marker = {
  findAll: async (params) => {
    await reap();
    const query = ['SELECT id, submitted_by, site_id, created_at FROM markers'];
    if (params.per_page && params.page) {
      query.push(`LIMIT ${params.per_page} OFFSET ${(params.page - 1) * params.per_page}`);
    }
    const result = await db.query(query.join(' '));

    return result.rows;
  },
  findById: async (id) => {
    await reap();
    const result = await db.query('SELECT id, submitted_by, site_id, created_at FROM markers WHERE id = $1', [id]);
    return result.rows[0];
  },
  create: async (marker) => {
    if (!marker.id) marker.id = uuid.v4();
    const result = await db.query('INSERT INTO markers(id, submitted_by, site_id) VALUES($1, $2, $3) RETURNING *', [marker.id, marker.submitted_by, marker.site_id]);
    return result.rows[0];
  },
  delete: async (id) => {
    const result = await db.query('DELETE FROM markers WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  },
};

module.exports = Marker;
