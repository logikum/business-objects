console.log('Testing data-access/data-type-error.js...');

var DaoError = require('../../../source/data-access/dao-error.js');

describe('Data access object error', function() {

  it('constructor expects one optional argument', function() {
    var de1 = new DaoError();
    var de2 = new DaoError('The data access object is wrong.');
    var de3 = new DaoError('default');

    expect(de1).toEqual(jasmine.any(Error));
    expect(de1.name).toBe('DaoError');
    expect(de1.message).toBe('A data access object error occurred.');

    expect(de2).toEqual(jasmine.any(Error));
    expect(de2.name).toBe('DaoError');
    expect(de2.message).toBe('The data access object is wrong.');

    expect(de3).toEqual(jasmine.any(Error));
    expect(de3.name).toBe('DaoError');
    expect(de3.message).toBe('A data access object error occurred.');
  });
});
