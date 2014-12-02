console.log('Testing rules/authorization-action.js...');

var AuthorizationAction = require('../../source/rules/authorization-action.js');

describe('Authorization action enumeration', function () {

  it('has the defined items', function() {

    expect(AuthorizationAction.readProperty).toBe(0);
    expect(AuthorizationAction.writeProperty).toBe(1);
    expect(AuthorizationAction.fetchObject).toBe(2);
    expect(AuthorizationAction.createObject).toBe(3);
    expect(AuthorizationAction.updateObject).toBe(4);
    expect(AuthorizationAction.removeObject).toBe(5);
    expect(AuthorizationAction.executeMethod).toBe(6);
  });

  it('count method returns the item count', function() {

    expect(AuthorizationAction.count()).toBe(7);
  });

  it('getName method returns the item name', function() {

    expect(AuthorizationAction.getName(0)).toBe('readProperty');
    expect(AuthorizationAction.getName(1)).toBe('writeProperty');
    expect(AuthorizationAction.getName(2)).toBe('fetchObject');
    expect(AuthorizationAction.getName(3)).toBe('createObject');
    expect(AuthorizationAction.getName(4)).toBe('updateObject');
    expect(AuthorizationAction.getName(5)).toBe('removeObject');
    expect(AuthorizationAction.getName(6)).toBe('executeMethod');
  });

  it('getValue method returns the item value', function() {

    expect(AuthorizationAction.getValue('readProperty')).toBe(0);
    expect(AuthorizationAction.getValue('writeProperty')).toBe(1);
    expect(AuthorizationAction.getValue('fetchObject')).toBe(2);
    expect(AuthorizationAction.getValue('createObject')).toBe(3);
    expect(AuthorizationAction.getValue('updateObject')).toBe(4);
    expect(AuthorizationAction.getValue('removeObject')).toBe(5);
    expect(AuthorizationAction.getValue('executeMethod')).toBe(6);
  });

  it('check method inspects a value', function() {

    function check1() {AuthorizationAction.check(-1); }
    function check2() {AuthorizationAction.check(AuthorizationAction.readProperty); }
    function check3() {AuthorizationAction.check(AuthorizationAction.writeProperty); }
    function check4() {AuthorizationAction.check(AuthorizationAction.fetchObject); }
    function check5() {AuthorizationAction.check(AuthorizationAction.createObject); }
    function check6() {AuthorizationAction.check(AuthorizationAction.updateObject); }
    function check7() {AuthorizationAction.check(AuthorizationAction.removeObject); }
    function check8() {AuthorizationAction.check(AuthorizationAction.executeMethod); }
    function check9() {AuthorizationAction.check(7); }

    expect(check1).toThrow();
    expect(check2).not.toThrow();
    expect(check3).not.toThrow();
    expect(check4).not.toThrow();
    expect(check5).not.toThrow();
    expect(check6).not.toThrow();
    expect(check7).not.toThrow();
    expect(check8).not.toThrow();
    expect(check9).toThrow();
  });
});
