console.log('Testing rules/no-access-behavior.js...');

var NoAccessBehavior = require('../../source/rules/no-access-behavior.js');

describe('No access behavior enumeration', function () {

  it('has the defined items', function() {

    expect(NoAccessBehavior.throwError).toBe(0);
    expect(NoAccessBehavior.showError).toBe(1);
    expect(NoAccessBehavior.showWarning).toBe(2);
    expect(NoAccessBehavior.showInformation).toBe(3);
  });

  it('count method returns the item count', function() {

    expect(NoAccessBehavior.count()).toBe(4);
  });

  it('getName method returns the item name', function() {

    expect(NoAccessBehavior.getName(0)).toBe('throwError');
    expect(NoAccessBehavior.getName(1)).toBe('showError');
    expect(NoAccessBehavior.getName(2)).toBe('showWarning');
    expect(NoAccessBehavior.getName(3)).toBe('showInformation');
  });

  it('getValue method returns the item value', function() {

    expect(NoAccessBehavior.getValue('throwError')).toBe(0);
    expect(NoAccessBehavior.getValue('showError')).toBe(1);
    expect(NoAccessBehavior.getValue('showWarning')).toBe(2);
    expect(NoAccessBehavior.getValue('showInformation')).toBe(3);
  });

  it('check method inspects a value', function() {

    function check1() {NoAccessBehavior.check(-1); }
    function check2() {NoAccessBehavior.check(NoAccessBehavior.throwError); }
    function check3() {NoAccessBehavior.check(NoAccessBehavior.showError); }
    function check4() {NoAccessBehavior.check(NoAccessBehavior.showWarning); }
    function check5() {NoAccessBehavior.check(NoAccessBehavior.showInformation); }
    function check6() {NoAccessBehavior.check(4); }

    expect(check1).toThrow();
    expect(check2).not.toThrow();
    expect(check3).not.toThrow();
    expect(check4).not.toThrow();
    expect(check5).not.toThrow();
    expect(check6).toThrow();
  });
});
