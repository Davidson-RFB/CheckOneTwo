module.exports = query =>
  Object.assign({}, {
    per_page: 20,
    page: 1,
  }, query);
