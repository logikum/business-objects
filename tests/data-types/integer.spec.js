console.log('Testing data-types/integer.js...');

var Integer = require('../../source/data-types/integer.js');
var DataType = require('../../source/data-types/data-type.js');

describe('Integer type', function() {
  var dt = new Integer();

  it('constructor returns a data type', function() {

    expect(dt).toEqual(jasmine.any(DataType));
  });

  it('has one read-only property', function() {
    dt.name = '---';

    expect(dt.name).toBe('Integer');
  });

  it('parse method expects integer', function() {
    function fn() {}

    expect(dt.parse()).toBeNull();
    expect(dt.parse(null)).toBeNull();
    expect(dt.parse(true)).toBe(1);
    expect(dt.parse(0)).toBe(0);
    expect(dt.parse(3.1415926)).toBeUndefined();
    expect(dt.parse('')).toBe(0);
    expect(dt.parse('Shakespeare')).toBeUndefined();
    expect(dt.parse(new Date())).toBeGreaterThan(1000000);
    expect(dt.parse({})).toBeUndefined();
    expect(dt.parse([])).toBe(0);
    expect(dt.parse(fn)).toBeUndefined();
    expect(dt.parse('1456')).toBe(1456);
    expect(dt.parse('0x101')).toBe(257);
  });

  it('hasValue method works', function() {

    expect(dt.hasValue()).toBe(false);
    expect(dt.hasValue(null)).toBe(false);
    expect(dt.hasValue(0)).toBe(true);
    expect(dt.hasValue(278954)).toBe(true);
    expect(dt.hasValue(-2014)).toBe(true);
  });
});
