const uuid = require('uuid');
const { db, mail } = require('../../config');
const Group = require('./group');
const Site = require('./site');
const Nominee = require('./nominee');

const addUUIDs = (i) => {
  if (!i.uuid) i.uuid = uuid.v4();
  return i;
};

const emailNominees = async (check) => {
  if (check.items.reduce((r, item) => {
    if (r) return r;
    return item.status !== 'pass';
  }, false)) {
    const site = await Site.findById(check.site_id);
    const group = await Group.findById(site.group_id);
    const nominees = await Nominee.findAll({});

    await Promise.all(nominees.map(nominee => mail.sendFailedCheck(nominee.email, check, site, group)));
  }
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

    await emailNominees(result.rows[0]);

    return result.rows[0];
  },
  update: async (check) => {
    const now = new Date().toISOString();
    const result = await db.query('UPDATE checks SET (site_id, items, submitted_by, updated_at) = ($2, $3, $4, $5) WHERE id = $1 RETURNING *', [check.id, check.site_id, JSON.stringify(check.items.map(addUUIDs)), check.submitted_by, now]);
    return result.rows[0];
  },
};

module.exports = Check;
