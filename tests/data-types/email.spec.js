console.log('Testing data-types/email.js...');

var Email = require('../../source/data-types/email.js');
var DataType = require('../../source/data-types/data-type.js');

describe('Email type', function() {
  var dt = new Email();

  it('constructor returns a data type', function() {

    expect(dt).toEqual(jasmine.any(DataType));
  });

  it('has one read-only property', function() {
    dt.name = '---';

    expect(dt.name).toBe('Email');
  });

  it('check method expects an e-mail address', function() {
    function fn() {}

    function check01() { dt.check(); }
    function check02() { dt.check(null); }
    function check03() { dt.check(true); }
    function check04() { dt.check(0); }
    function check05() { dt.check(''); }
    function check06() { dt.check(new Date()); }
    function check07() { dt.check('Nile'); }
    function check08() { dt.check('employee@company'); }
    function check09() { dt.check('employee@company.com'); }

    expect(check01).toThrow();
    expect(check02).not.toThrow();
    expect(check03).toThrow();
    expect(check04).toThrow();
    expect(check05).toThrow();
    expect(check06).toThrow();
    expect(check07).toThrow();
    expect(check08).toThrow();
    expect(check09).not.toThrow();
  });

  it('hasValue method works', function() {
    function hasValue1() { return dt.hasValue(); }
    function hasValue2() { return dt.hasValue(''); }
    function hasValue3() { return dt.hasValue('Nile'); }

    expect(hasValue1).toThrow();
    expect(hasValue2).toThrow();
    expect(hasValue3).toThrow();
    expect(dt.hasValue(null)).toBe(false);
    expect(dt.hasValue('employee@company.com')).toBe(true);
  });
});
