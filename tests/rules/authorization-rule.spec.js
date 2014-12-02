console.log('Testing main.js...');

var AuthorizationRule = require('../../source/rules/authorization-rule.js');
var RuleBase = require('../../source/rules/rule-base.js');
var AuthorizationAction = require('../../source/rules/authorization-action.js');
var PropertyInfo = require('../../source/shared/property-info.js');
var Text = require('../../source/data-types/text.js');

describe('Authorization rule', function () {

  it('constructor expects a non-empty string argument', function () {
    var build01 = function () { return new AuthorizationRule(); };
    var build02 = function () { return new AuthorizationRule(null); };
    var build03 = function () { return new AuthorizationRule(''); };
    var build04 = function () { return new AuthorizationRule('ruleName'); };
    var build05 = function () { return new AuthorizationRule(true); };
    var build06 = function () { return new AuthorizationRule(777); };
    var build07 = function () { return new AuthorizationRule({}); };
    var build08 = function () { return new AuthorizationRule(['ruleName']); };

    expect(build01).toThrow();
    expect(build02).toThrow();
    expect(build03).toThrow();
    expect(build04).not.toThrow();
    expect(build05).toThrow();
    expect(build06).toThrow();
    expect(build07).toThrow();
    expect(build08).toThrow();
  });

  it('inherits rule base type', function() {
    var rule = new AuthorizationRule('ruleName');

    expect(rule).toEqual(jasmine.any(RuleBase));
  });

  it('has four properties', function() {
    var rule = new AuthorizationRule('ruleName');

    expect(rule.ruleName).toBe('ruleName');
    expect(rule.message).toBeNull();
    expect(rule.priority).toBe(10);
    expect(rule.stopsProcessing).toBe(false);
  });

  it('initialize method works', function() {
    var property = new PropertyInfo('property', new Text(), true);
    var rule1 = new AuthorizationRule('ruleName #1');
    rule1.initialize(AuthorizationAction.readProperty, property, 'message #1', 19, true);
    var rule2 = new AuthorizationRule('ruleName #2');
    rule2.initialize(AuthorizationAction.executeMethod, 'getByName', 'message #2', 17, false);
    var rule3 = new AuthorizationRule('ruleName #3');
    rule3.initialize(AuthorizationAction.updateObject, null, 'message #3', 13, true);

    expect(rule1.ruleName).toBe('ruleName #1');
    expect(rule1.message).toBe('message #1');
    expect(rule1.priority).toBe(19);
    expect(rule1.stopsProcessing).toBe(true);

    expect(rule2.ruleName).toBe('ruleName #2');
    expect(rule2.message).toBe('message #2');
    expect(rule2.priority).toBe(17);
    expect(rule2.stopsProcessing).toBe(false);

    expect(rule3.ruleName).toBe('ruleName #3');
    expect(rule3.message).toBe('message #3');
    expect(rule3.priority).toBe(13);
    expect(rule3.stopsProcessing).toBe(true);
  });

});
