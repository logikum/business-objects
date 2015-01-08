console.log('Testing data-types/data-type.js...');

var DataType = require('../../source/data-types/data-type.js');

describe('Base data type', function() {
  var dt = new DataType('name');

  it('constructor expects a non-empty string argument', function () {
    var build01 = function () { return new DataType(); };
    var build02 = function () { return new DataType(null); };
    var build03 = function () { return new DataType(''); };
    var build04 = function () { return new DataType('float'); };
    var build05 = function () { return new DataType(false); };
    var build06 = function () { return new DataType(125); };
    var build07 = function () { return new DataType({}); };
    var build08 = function () { return new DataType(['float']); };

    expect(build01).toThrow();
    expect(build02).toThrow();
    expect(build03).toThrow();
    expect(build04).not.toThrow();
    expect(build05).toThrow();
    expect(build06).toThrow();
    expect(build07).toThrow();
    expect(build08).toThrow();
  });

  it('has one property', function() {

    expect(dt.name).toBe('name');
  });

  it('has one read-only property and two fixed methods', function() {
    dt.name = 'anonymous';

    expect(dt.name).toBe('name');

    dt.check = undefined;
    dt.hasValue = undefined;

    expect(dt.check).toBeDefined();
    expect(dt.hasValue).toBeDefined();
  });

  it('has two not implemented methods', function() {
    dt.check = function () { return false; };
    dt.hasValue = function () { return true; };

    function call1() { dt.check(1); }
    function call2() { dt.hasValue(2); }

    expect(call1).toThrow();
    expect(call2).toThrow();
  });
});
