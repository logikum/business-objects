console.log('Testing common-rules/null-result-option.js...');

var NullResultOption = require('../../../source/common-rules/null-result-option.js');

describe('No result option enumeration', function () {

  it('$name property returns the type name', function() {

    expect(NullResultOption.$name).toBe('NullResultOption');
  });

  it('has the defined items', function() {

    expect(NullResultOption.returnTrue).toBe(0);
    expect(NullResultOption.returnFalse).toBe(1);
    expect(NullResultOption.convertToEmptyString).toBe(2);
  });

  it('count method returns the item count', function() {

    expect(NullResultOption.count()).toBe(3);
  });

  it('getName method returns the item name', function() {

    expect(NullResultOption.getName(0)).toBe('returnTrue');
    expect(NullResultOption.getName(1)).toBe('returnFalse');
    expect(NullResultOption.getName(2)).toBe('convertToEmptyString');
  });

  it('getValue method returns the item value', function() {

    expect(NullResultOption.getValue('returnTrue')).toBe(0);
    expect(NullResultOption.getValue('returnFalse')).toBe(1);
    expect(NullResultOption.getValue('convertToEmptyString')).toBe(2);
  });

  it('check method inspects a value', function() {

    function check1() {NullResultOption.check(-1); }
    function check2() {NullResultOption.check(NullResultOption.returnTrue); }
    function check3() {NullResultOption.check(NullResultOption.returnFalse); }
    function check4() {NullResultOption.check(NullResultOption.convertToEmptyString); }
    function check5() {NullResultOption.check(3); }

    expect(check1).toThrow();
    expect(check2).not.toThrow();
    expect(check3).not.toThrow();
    expect(check4).not.toThrow();
    expect(check5).toThrow();
  });
});
