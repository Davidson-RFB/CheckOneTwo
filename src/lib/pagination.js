module.exports = (query) => {
  const paginated = Object.assign({}, {
    per_page: 20,
    page: 1,
  }, query);
  if (!parseInt(paginated.per_page, 10)) paginated.per_page = undefined;
  if (!parseInt(paginated.page, 10)) paginated.page = undefined;
  return paginated;
};
