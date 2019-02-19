const pagination = require('../../src/lib/pagination');

describe('pagination', () => {
  it('must default per_page to 200', () => {
    const result = pagination({});
    expect(result.per_page).to.equal(200);
  });

  it('must default page to 1', () => {
    const result = pagination({});
    expect(result.page).to.equal(1);
  });

  it('must respect a set per_page', () => {
    const result = pagination({ per_page: 5 });
    expect(result.per_page).to.equal(5);
  });

  it('must respect a set page', () => {
    const result = pagination({ page: 5 });
    expect(result.page).to.equal(5);
  });

  it('must pass through non-pagination values', () => {
    const result = pagination({ foo: 'bar' });
    expect(result.foo).to.equal('bar');
  });

  it('must sanitise pagination values', () => {
    const result = pagination({ page: 'lol injection attack' });
    expect(result.page).to.be(undefined);
  });
});
