console.log('Testing data-types/data-type.js...');

var DataType = require('../../source/data-types/data-type.js');

describe('Base data type', function() {
  var dt = DataType.create('name');

  it('has one property', function() {

    expect(dt.name).toBe('name');
  });

  it('has two not implemented methods', function() {
    function call1() { dt.check(1); }
    function call2() { dt.hasValue(2); }

    expect(dt.check).toBeDefined();
    expect(dt.hasValue).toBeDefined();

    expect(call1).toThrow();
    expect(call2).toThrow();
  });
});
