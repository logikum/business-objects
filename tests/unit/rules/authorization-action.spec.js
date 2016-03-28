console.log('Testing rules/authorization-action.js...');

var AuthorizationAction = require('../../../source/rules/authorization-action.js');

describe('Authorization action enumeration', function () {

  it('$name property returns the type name', function() {

    expect(AuthorizationAction.$name).toBe('AuthorizationAction');
  });

  it('has the defined items', function() {

    expect(AuthorizationAction.fetchObject).toBe(0);
    expect(AuthorizationAction.createObject).toBe(1);
    expect(AuthorizationAction.updateObject).toBe(2);
    expect(AuthorizationAction.removeObject).toBe(3);
    expect(AuthorizationAction.executeCommand).toBe(4);
    expect(AuthorizationAction.executeMethod).toBe(5);
    expect(AuthorizationAction.readProperty).toBe(6);
    expect(AuthorizationAction.writeProperty).toBe(7);
  });

  it('count method returns the item count', function() {

    expect(AuthorizationAction.count()).toBe(8);
  });

  it('getName method returns the item name', function() {

    expect(AuthorizationAction.getName(0)).toBe('fetchObject');
    expect(AuthorizationAction.getName(1)).toBe('createObject');
    expect(AuthorizationAction.getName(2)).toBe('updateObject');
    expect(AuthorizationAction.getName(3)).toBe('removeObject');
    expect(AuthorizationAction.getName(4)).toBe('executeCommand');
    expect(AuthorizationAction.getName(5)).toBe('executeMethod');
    expect(AuthorizationAction.getName(6)).toBe('readProperty');
    expect(AuthorizationAction.getName(7)).toBe('writeProperty');
  });

  it('getValue method returns the item value', function() {

    expect(AuthorizationAction.getValue('fetchObject')).toBe(0);
    expect(AuthorizationAction.getValue('createObject')).toBe(1);
    expect(AuthorizationAction.getValue('updateObject')).toBe(2);
    expect(AuthorizationAction.getValue('removeObject')).toBe(3);
    expect(AuthorizationAction.getValue('executeCommand')).toBe(4);
    expect(AuthorizationAction.getValue('executeMethod')).toBe(5);
    expect(AuthorizationAction.getValue('readProperty')).toBe(6);
    expect(AuthorizationAction.getValue('writeProperty')).toBe(7);
  });

  it('check method inspects a value', function() {

    function check01() {AuthorizationAction.check(-1); }
    function check02() {AuthorizationAction.check(AuthorizationAction.fetchObject); }
    function check03() {AuthorizationAction.check(AuthorizationAction.createObject); }
    function check04() {AuthorizationAction.check(AuthorizationAction.updateObject); }
    function check05() {AuthorizationAction.check(AuthorizationAction.removeObject); }
    function check06() {AuthorizationAction.check(AuthorizationAction.executeCommand); }
    function check07() {AuthorizationAction.check(AuthorizationAction.executeMethod); }
    function check08() {AuthorizationAction.check(AuthorizationAction.readProperty); }
    function check09() {AuthorizationAction.check(AuthorizationAction.writeProperty); }
    function check10() {AuthorizationAction.check(8); }

    expect(check01).toThrow();
    expect(check02).not.toThrow();
    expect(check03).not.toThrow();
    expect(check04).not.toThrow();
    expect(check05).not.toThrow();
    expect(check06).not.toThrow();
    expect(check07).not.toThrow();
    expect(check08).not.toThrow();
    expect(check09).not.toThrow();
    expect(check10).toThrow();
  });
});
