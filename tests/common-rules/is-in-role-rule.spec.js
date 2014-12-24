console.log('Testing common-rules/is-in-role-rule.js...');

var IsInRoleRule = require('../../source/common-rules/is-in-role-rule.js');
var AuthorizationRule = require('../../source/rules/authorization-rule.js');
var AuthorizationAction = require('../../source/rules/authorization-action.js');
var User = require('../../sample/user.js');

describe('Is-in-role rule', function () {

  it('constructor expects three-to-six arguments', function () {
    var build01 = function () { return new IsInRoleRule(); };
    var build02 = function () { return new IsInRoleRule(AuthorizationAction.updateObject); };
    var build03 = function () { return new IsInRoleRule(AuthorizationAction.updateObject, null); };
    var build04 = function () { return new IsInRoleRule(AuthorizationAction.updateObject, null, 'developers'); };
    var build05 = function () { return new IsInRoleRule(AuthorizationAction.updateObject, null, 'developers', 'message'); };
    var build06 = function () { return new IsInRoleRule(AuthorizationAction.updateObject, null, 'developers', 'message', 100); };
    var build07 = function () { return new IsInRoleRule(AuthorizationAction.updateObject, null, 'developers', 'message', 100, true); };
    var build08 = function () { return new IsInRoleRule(4, null, 'developers', 'message', 100, true); };
    var build09 = function () { return new IsInRoleRule(AuthorizationAction.updateObject, null, ['men', 'women'], 'message', 100, true); };

    expect(build01).toThrow();
    expect(build02).toThrow();
    expect(build03).toThrow();
    expect(build04).not.toThrow();
    expect(build05).not.toThrow();
    expect(build06).not.toThrow();
    expect(build07).not.toThrow();
    expect(build08).not.toThrow();
    expect(build09).toThrow();
  });

  it('inherits authorization rule type', function() {
    var rule = new IsInRoleRule(AuthorizationAction.updateObject, null, 'developers', 'message', 100, true);

    expect(rule).toEqual(jasmine.any(AuthorizationRule));
  });

  it('has four properties', function () {
    var rule = new IsInRoleRule(AuthorizationAction.updateObject, null, 'developers', 'message', 100, true);

    expect(rule.ruleName).toBe('IsInRole');
    expect(rule.message).toBe('message');
    expect(rule.priority).toBe(100);
    expect(rule.stopsProcessing).toBe(true);
  });

  it('execute method works', function() {
    var john = new User('john', 'John Smith', 'john@company.com', ['salesmen']);
    var paul = new User('paul', 'Paul Smith', 'paul@company.com', ['testers', 'developers']);
    var rule_1 = new IsInRoleRule(AuthorizationAction.createObject, null, 'developers', 'message', 100, true);
    var rule_2 = new IsInRoleRule(AuthorizationAction.removeObject, null, 'salesmen', 'message', 100, true);

    var call01 = function () { rule_1.execute(); };
    var call02 = function () { rule_1.execute(john); };
    var call03 = function () { rule_2.execute(paul); };

    expect(call01).toThrow();
    expect(call02).toThrow();
    expect(call03).toThrow();
    expect(rule_1.execute(paul)).toBeUndefined();
    expect(rule_2.execute(john)).toBeUndefined();
  });
});
