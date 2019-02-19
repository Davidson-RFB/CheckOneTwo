const httperrors = require('httperrors');
const uuid = require('uuid');
const { db } = require('../../config');
const logger = require('../../config/logger');

const addUUIDs = (i) => {
  if (!i.uuid) i.uuid = uuid.v4();
  return i;
};

const validUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const findLastChecked = async (input) => {
  if (!input) return input;

  const site = Object.assign({}, input);

  try {
    const lastCheckResult = await db.query('SELECT created_at, submitted_by FROM checks WHERE site_id = $1 ORDER BY created_at DESC LIMIT 1', [site.id]);
    const check = lastCheckResult.rows[0];

    site.last_checked_at = check.created_at;
    site.last_checked_by = check.submitted_by;
  } catch (e) {
    site.last_checked_at = new Date(0);
  }

  return site;
};

const Site = {
  findAll: async (params) => {
    const query = [`
    SELECT
      id, group_id, name, items, c.last_checked_at, c.last_checked_by
    FROM
      sites AS s
      LEFT JOIN LATERAL (
        SELECT
          site_id, created_at AS last_checked_at, submitted_by AS last_checked_by
        FROM
          checks AS c
        WHERE
          c.site_id = s.id
        ORDER BY created_at DESC LIMIT 1
      ) AS c on 1=1
    `];

    const args = [];

    if (params.by_group) {
      query.push('WHERE s.group_id = $1');
      args.push(params.by_group);
    }

    if (params.per_page && params.page) {
      query.push(`LIMIT ${params.per_page} OFFSET ${(params.page - 1) * params.per_page}`);
    }
    const result = await db.query(query.join(' '), args);

    return result.rows;
  },
  findById: async (id) => {
    const query = `
    SELECT
      id, group_id, name, items, c.last_checked_at, c.last_checked_by
    FROM
      sites AS s
      LEFT JOIN LATERAL (
        SELECT
          site_id, created_at AS last_checked_at, submitted_by AS last_checked_by
        FROM
          checks AS c
        WHERE
          c.site_id = s.id
        ORDER BY created_at DESC LIMIT 1
      ) AS c on 1=1
      WHERE id = $1
    `;
    const result = await db.query(query, [id]);

    return result.rows[0];
  },
  create: async (site) => {
    if (!site.id) site.id = uuid.v4();
    const items = site.items || [];
    const result = await db.query('INSERT INTO sites(id, group_id, name, items) VALUES($1, $2, $3, $4) RETURNING *', [site.id, site.group_id, site.name, JSON.stringify(items.map(addUUIDs))]);
    return result.rows[0];
  },
  update: async (site) => {
    const now = new Date().toISOString();
    const result = await db.query('UPDATE sites SET (group_id, name, items, updated_at) = ($2, $3, $4, $5) WHERE id = $1 RETURNING *', [site.id, site.group_id, site.name, JSON.stringify(site.items.map(addUUIDs)), now]);
    return result.rows[0];
  },
  itemHistory: async (itemId, params) => {
    if (!validUuid.test(itemId)) throw httperrors.BadRequest('invalid uuid');
    const query = [`SELECT items, id, created_at, submitted_by FROM checks WHERE items @> '[{"uuid": "${itemId}"}]'`];

    query.push('ORDER BY created_at DESC');

    if (params.per_page && params.page) {
      query.push(`LIMIT ${params.per_page} OFFSET ${(params.page - 1) * params.per_page}`);
    }

    const result = await db.query(query.join(' '));

    const checks = result.rows.map((row) => {
      row.items = row.items.filter(item => item.uuid === itemId);
      return row;
    });

    return checks;
  },
};

module.exports = Site;
