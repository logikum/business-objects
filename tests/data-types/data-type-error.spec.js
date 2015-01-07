console.log('Testing data-types/data-type-error.js...');

var DataTypeError = require('../../source/data-types/data-type-error.js');

describe('Data type error', function() {

  it('constructor expects one optional argument', function() {
    var dte1 = new DataTypeError();
    var dte2 = new DataTypeError('The passed value is not object.');
    var dte3 = new DataTypeError('default');

    expect(dte1).toEqual(jasmine.any(Error));
    expect(dte1.name).toBe('DataTypeError');
    expect(dte1.message).toBe('The data type of the passed value is invalid.');

    expect(dte2).toEqual(jasmine.any(Error));
    expect(dte2.name).toBe('DataTypeError');
    expect(dte2.message).toBe('The passed value is not object.');

    expect(dte3).toEqual(jasmine.any(Error));
    expect(dte3.name).toBe('DataTypeError');
    expect(dte3.message).toBe('The data type of the passed value is invalid.');
  });
});
