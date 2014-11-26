console.log('Testing data-types/decimal.js...');

var Decimal = require('../../source/data-types/decimal.js');
var DataType = require('../../source/data-types/data-type.js');

describe('Decimal type', function() {
  var dt = new Decimal();

  it('constructor returns a data type', function() {

    expect(dt).toEqual(jasmine.any(DataType));
  });

  it('has one read-only property', function() {
    dt.name = '---';

    expect(dt.name).toBe('Decimal');
  });

  it('check method expects decimal', function() {
    function fn() {}

    function check01() { dt.check(); }
    function check02() { dt.check(null); }
    function check03() { dt.check(true); }
    function check04() { dt.check(0); }
    function check05() { dt.check(3.1415926); }
    function check06() { dt.check(''); }
    function check07() { dt.check('Shakespeare'); }
    function check08() { dt.check(new Date()); }
    function check09() { dt.check({}); }
    function check10() { dt.check([]); }
    function check11() { dt.check(fn); }

    expect(check01).toThrow();
    expect(check02).not.toThrow();
    expect(check03).toThrow();
    expect(check04).not.toThrow();
    expect(check05).not.toThrow();
    expect(check06).toThrow();
    expect(check07).toThrow();
    expect(check08).toThrow();
    expect(check09).toThrow();
    expect(check10).toThrow();
    expect(check11).toThrow();
  });

  it('hasValue method works', function() {
    function hasValue1() { return dt.hasValue(); }

    expect(hasValue1).toThrow();
    expect(dt.hasValue(null)).toBe(false);
    expect(dt.hasValue(0)).toBe(true);
    expect(dt.hasValue(1024)).toBe(true);
    expect(dt.hasValue(3.1415926)).toBe(true);
    expect(dt.hasValue(-45672.78)).toBe(true);
  });
});
