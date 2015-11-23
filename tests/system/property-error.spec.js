console.log('Testing system/property-error.js...');

var PropertyError = require('../../source/system/property-error.js');

describe('Property error', function() {

  it('constructor expects an optional message', function() {
    var pe1 = new PropertyError();
    var pe2 = new PropertyError('The argument is null or invalid.');
    var pe3 = new PropertyError('default');

    expect(pe1).toEqual(jasmine.any(Error));
    expect(pe1.name).toBe('PropertyError');
    expect(pe1.message).toBe('The value passed to the property is invalid.');

    expect(pe2).toEqual(jasmine.any(Error));
    expect(pe2.name).toBe('PropertyError');
    expect(pe2.message).toBe('The argument is null or invalid.');

    expect(pe3).toEqual(jasmine.any(Error));
    expect(pe3.name).toBe('PropertyError');
    expect(pe3.message).toBe('The value passed to the property is invalid.');
  });
});
