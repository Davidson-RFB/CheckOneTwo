const uuid = require('uuid');
const { db } = require('../../config');

const addUUIDs = (i) => {
  if (!i.uuid) i.uuid = uuid.v4();
  return i;
};

const findLastChecked = async (input) => {
  if (!input) return input;

  const site = Object.assign({}, input);

  try {
    const lastCheckResult = await db.query('SELECT created_at FROM checks WHERE site_id = $1 ORDER BY created_at DESC LIMIT 1', [site.id]);
    const check = lastCheckResult.rows[0];

    site.last_checked_at = check.created_at;
  } catch (e) {
    site.last_checked_at = new Date(0);
  }

  return site;
};

const Site = {
  findAll: async (params) => {
    const query = ['SELECT id, group_id, name, items FROM sites'];
    if (params.per_page && params.page) {
      query.push(`LIMIT ${params.per_page} OFFSET ${(params.page - 1) * params.per_page}`);
    }
    const result = await db.query(query.join(' '));

    const rows = await Promise.all(result.rows.map(findLastChecked));

    return rows;
  },
  findById: async (id) => {
    const result = await db.query('SELECT id, group_id, name, items FROM sites WHERE id = $1', [id]);

    const site = await findLastChecked(result.rows[0]);

    return site;
  },
  create: async (site) => {
    if (!site.id) site.id = uuid.v4();
    const result = await db.query('INSERT INTO sites(id, group_id, name, items) VALUES($1, $2, $3, $4) RETURNING *', [site.id, site.group_id, site.name, JSON.stringify(site.items.map(addUUIDs))]);
    return result.rows[0];
  },
  update: async (site) => {
    const now = new Date().toISOString();
    const result = await db.query('UPDATE sites SET (group_id, name, items, updated_at) = ($2, $3, $4, $5) WHERE id = $1 RETURNING *', [site.id, site.group_id, site.name, JSON.stringify(site.items.map(addUUIDs)), now]);
    return result.rows[0];
  },
};

module.exports = Site;
