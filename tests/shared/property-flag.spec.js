console.log('Testing shared/property-flag.js...');

var PropertyFlag = require('../../source/shared/property-flag.js');

describe('Property flag', function () {

  it('has the defined items', function() {

    expect(PropertyFlag.readOnly).toBe(1);
    expect(PropertyFlag.key).toBe(2);
    expect(PropertyFlag.parentKey).toBe(4);
    expect(PropertyFlag.notOnDto).toBe(8);
    expect(PropertyFlag.notOnCto).toBe(16);
  });

  it('items are read-only', function() {
    PropertyFlag.readOnly = 9;
    PropertyFlag.key = 10;
    PropertyFlag.parentKey = 11;
    PropertyFlag.notOnDto = 12;
    PropertyFlag.notOnCto = 13;

    expect(PropertyFlag.readOnly).toBe(1);
    expect(PropertyFlag.key).toBe(2);
    expect(PropertyFlag.parentKey).toBe(4);
    expect(PropertyFlag.notOnDto).toBe(8);
    expect(PropertyFlag.notOnCto).toBe(16);
  });
});
