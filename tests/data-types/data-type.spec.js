console.log('Testing data-types/data-type.js...');

var DataType = require('../../source/data-types/data-type.js');

describe('Base data type', function() {
  var dt = null;

  it('constructor expects no argument', function () {
    var build01 = function () { dt = new DataType(); };

    expect(build01).not.toThrow();
  });

  it('has one property', function() {

    expect(dt.name).toBe('DataType');
  });

  it('has one read-only property and two fixed methods', function() {
    dt.name = 'anonymous';

    expect(dt.name).toBe('DataType');

    dt.parse = undefined;
    dt.hasValue = undefined;

    expect(dt.parse).toBeDefined();
    expect(dt.hasValue).toBeDefined();
  });

  it('has two not implemented methods', function() {
    dt.parse = function () { return false; };
    dt.hasValue = function () { return true; };

    function call1() { dt.parse(1); }
    function call2() { dt.hasValue(2); }

    expect(call1).toThrow();
    expect(call2).toThrow();
  });
});
