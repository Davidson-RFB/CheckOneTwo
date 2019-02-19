const uuid = require('uuid');
const { db } = require('../../config');

const findLastChecked = async (input) => {
  if (!input) return input;

  const group = Object.assign({}, input);

  try {
    const lastCheckResult = await db.query('SELECT checks.created_at, checks.submitted_by FROM checks JOIN sites ON checks.site_id = sites.id WHERE sites.group_id = $1 ORDER BY created_at DESC LIMIT 1', [group.id]);
    const check = lastCheckResult.rows[0];

    group.last_checked_at = check.created_at;
    group.last_checked_by = check.submitted_by;
  } catch (e) {
    group.last_checked_at = new Date(0);
  }

  return group;
};

const Group = {
  findAll: async (params) => {
    const query = [`
    SELECT
      id, name, last_checked_at, last_checked_by
    FROM
      groups as g
      LEFT JOIN LATERAL (
        SELECT
          c.created_at AS last_checked_at, submitted_by AS last_checked_by
        FROM
          checks as c
          JOIN sites as s ON c.site_id = s.id
        WHERE
          s.group_id = g.id
        ORDER BY c.created_at DESC LIMIT 1
      ) AS c on 1=1
    `];
    if (params.per_page && params.page) {
      query.push(`LIMIT ${params.per_page} OFFSET ${(params.page - 1) * params.per_page}`);
    }
    const result = await db.query(query.join(' '));

    return result.rows;
  },
  findById: async (id) => {
    const query = `
    SELECT
      id, name, last_checked_at, last_checked_by
    FROM
      groups as g
      LEFT JOIN LATERAL (
        SELECT
          c.created_at AS last_checked_at, submitted_by AS last_checked_by
        FROM
          checks as c
          JOIN sites as s ON c.site_id = s.id
        WHERE
          s.group_id = g.id
        ORDER BY c.created_at DESC LIMIT 1
      ) AS c on 1=1
      WHERE g.id = $1
    `;
    const result = await db.query(query, [id]);

    return result.rows[0];
  },
  create: async (group) => {
    if (!group.id) group.id = uuid.v4();
    const result = await db.query('INSERT INTO groups(id, name) VALUES($1, $2) RETURNING *', [group.id, group.name]);
    return result.rows[0];
  },
  update: async (group) => {
    const now = new Date().toISOString();
    const result = await db.query('UPDATE groups SET (name, updated_at) = ($2, $3) WHERE id = $1 RETURNING *', [group.id, group.name, now]);
    return result.rows[0];
  },
};

module.exports = Group;
