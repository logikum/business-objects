console.log('Testing rules/rule-severity.js...');

var RuleSeverity = require('../../../source/rules/rule-severity.js');

describe('Rule severity enumeration', function () {

  it('$name property returns the type name', function() {

    expect(RuleSeverity.$name).toBe('RuleSeverity');
  });

  it('has the defined items', function() {

    expect(RuleSeverity.success).toBe(0);
    expect(RuleSeverity.information).toBe(1);
    expect(RuleSeverity.warning).toBe(2);
    expect(RuleSeverity.error).toBe(3);
  });

  it('count method returns the item count', function() {

    expect(RuleSeverity.count()).toBe(4);
  });

  it('getName method returns the item name', function() {

    expect(RuleSeverity.getName(0)).toBe('success');
    expect(RuleSeverity.getName(1)).toBe('information');
    expect(RuleSeverity.getName(2)).toBe('warning');
    expect(RuleSeverity.getName(3)).toBe('error');
  });

  it('getValue method returns the item value', function() {

    expect(RuleSeverity.getValue('success')).toBe(0);
    expect(RuleSeverity.getValue('information')).toBe(1);
    expect(RuleSeverity.getValue('warning')).toBe(2);
    expect(RuleSeverity.getValue('error')).toBe(3);
  });

  it('check method inspects a value', function() {

    function check1() {RuleSeverity.check(-1); }
    function check2() {RuleSeverity.check(RuleSeverity.success); }
    function check3() {RuleSeverity.check(RuleSeverity.information); }
    function check4() {RuleSeverity.check(RuleSeverity.warning); }
    function check5() {RuleSeverity.check(RuleSeverity.error); }
    function check6() {RuleSeverity.check(4); }

    expect(check1).toThrow();
    expect(check2).not.toThrow();
    expect(check3).not.toThrow();
    expect(check4).not.toThrow();
    expect(check5).not.toThrow();
    expect(check6).toThrow();
  });
});
