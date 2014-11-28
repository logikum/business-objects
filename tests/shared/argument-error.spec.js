console.log('Testing shared/argument-error.js...');

var ArgumentError = require('../../source/shared/argument-error.js');

describe('Argument error', function() {

  it('constructor expects an optional message', function() {
    var ee1 = new ArgumentError();
    var ee2 = new ArgumentError('The argument is null or invalid.');

    expect(ee1).toEqual(jasmine.any(Error));
    expect(ee1.name).toBe('ArgumentError');
    expect(ee1.message).toBe('The passed value is invalid.');

    expect(ee2).toEqual(jasmine.any(Error));
    expect(ee2.name).toBe('ArgumentError');
    expect(ee2.message).toBe('The argument is null or invalid.');
  });
});
