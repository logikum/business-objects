console.log('Testing data-types/enum.js...');

var Enum = require('../../source/data-types/enum.js');
var DataType = require('../../source/data-types/data-type.js');
var ModelState = require('../../source/shared/model-state.js');

describe('Enum type', function() {
  var dt = new Enum(ModelState);

  it('constructor returns a data type', function() {

    expect(dt).toEqual(jasmine.any(DataType));
  });

  it('has two read-only property', function() {
    dt.name = '---';
    dt.type = null;

    expect(dt.name).toBe('ModelState');
    expect(dt.type).toBe(ModelState);
  });

  it('check method expects enumeration item', function() {
    function fn() {}

    function check01() { dt.check(); }
    function check02() { dt.check(null); }
    function check03() { dt.check(true); }
    function check04() { dt.check(3.1415926); }
    function check05() { dt.check(''); }
    function check06() { dt.check('Shakespeare'); }
    function check07() { dt.check(new Date()); }
    function check08() { dt.check(ModelState.changed); }
    function check09() { dt.check(13); }

    expect(check01).toThrow();
    expect(check02).not.toThrow();
    expect(check03).toThrow();
    expect(check04).toThrow();
    expect(check05).toThrow();
    expect(check06).toThrow();
    expect(check07).toThrow();
    expect(check08).not.toThrow();
    expect(check09).toThrow();
  });

  it('hasValue method works', function() {
    function hasValue1() { return dt.hasValue(); }
    function hasValue2() { return dt.hasValue(-45672.78); }
    function hasValue3() { return dt.hasValue(ModelState.count()); }

    expect(hasValue1).toThrow();
    expect(hasValue2).toThrow();
    expect(hasValue3).toThrow();
    expect(dt.hasValue(null)).toBe(false);
    expect(dt.hasValue(ModelState.pristine)).toBe(true);
    expect(dt.hasValue(ModelState.created)).toBe(true);
    expect(dt.hasValue(ModelState.changed)).toBe(true);
    expect(dt.hasValue(ModelState.markedForRemoval)).toBe(true);
    expect(dt.hasValue(ModelState.removed)).toBe(true);
  });
});
