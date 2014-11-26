console.log('Testing data-types/text.js...');

var Text = require('../../source/data-types/text.js');
var DataType = require('../../source/data-types/data-type.js');

describe('Text type', function() {
  var dt = new Text();

  it('constructor returns a data type', function() {

    expect(dt).toEqual(jasmine.any(DataType));
  });

  it('has one read-only property', function() {
    dt.name = '---';

    expect(dt.name).toBe('Text');
  });

  it('check method expects string', function() {
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
    expect(check04).toThrow();
    expect(check05).toThrow();
    expect(check06).not.toThrow();
    expect(check07).not.toThrow();
    expect(check08).toThrow();
    expect(check09).toThrow();
    expect(check10).toThrow();
    expect(check11).toThrow();
  });

  it('hasValue method works', function() {
    function hasValue1() { return dt.hasValue(); }

    expect(hasValue1).toThrow();
    expect(dt.hasValue(null)).toBe(false);
    expect(dt.hasValue('')).toBe(false);
    expect(dt.hasValue('Shakespeare')).toBe(true);
  });
});
