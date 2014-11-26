console.log('Testing shared/not-implemented-error.js...');

var NotImplementedError = require('../../source/shared/not-implemented-error.js');

describe('Not implemented error', function() {

  it('constructor expects one optional argument', function() {
    var nie1 = new NotImplementedError();
    var nie2 = new NotImplementedError('Unexpected error occurred.');

    expect(nie1).toEqual(jasmine.any(Error));
    expect(nie1.name).toBe('NotImplementedError');
    expect(nie1.message).toBe('The method is not implemented.');

    expect(nie2).toEqual(jasmine.any(Error));
    expect(nie2.name).toBe('NotImplementedError');
    expect(nie2.message).toBe('Unexpected error occurred.');
  });
});
