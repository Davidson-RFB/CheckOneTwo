const uuid = require('uuid');
const { db } = require('../../config');

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
