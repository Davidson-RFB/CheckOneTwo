const pagination = require('../../src/lib/pagination');

describe('pagination', () => {
  it('must default per_page to 20', () => {
    const result = pagination({});
    expect(result.per_page).to.equal(20);
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

  it('must pass through unexpected values', () => {
    const result = pagination({ foo: 'bar' });
    expect(result.foo).to.equal('bar');
  });
});
