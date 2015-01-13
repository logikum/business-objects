console.log('Testing data-access/index.js...');

var da = require('../../source/data-access/index.js');

describe('Data access index', function() {

  it('returns correct data types', function() {

    expect(da.daoBuilder).toEqual(jasmine.any(Function));
    expect(da.DaoBase).toEqual(jasmine.any(Function));
    expect(da.DaoError).toEqual(jasmine.any(Function));
  });
});
