console.log('Testing shared/argument-error.js...');

var ArgumentError = require('../../source/shared/argument-error.js');

describe('Argument error', function() {

  it('constructor expects an optional message', function() {
    var ae1 = new ArgumentError();
    var ae2 = new ArgumentError('The argument is null or invalid.');
    var ae3 = new ArgumentError('default');

    expect(ae1).toEqual(jasmine.any(Error));
    expect(ae1.name).toBe('ArgumentError');
    expect(ae1.message).toBe('The passed value is invalid.');

    expect(ae2).toEqual(jasmine.any(Error));
    expect(ae2.name).toBe('ArgumentError');
    expect(ae2.message).toBe('The argument is null or invalid.');

    expect(ae3).toEqual(jasmine.any(Error));
    expect(ae3.name).toBe('ArgumentError');
    expect(ae3.message).toBe('The passed value is invalid.');
  });
});
