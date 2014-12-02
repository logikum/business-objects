console.log('Testing rules/authorization-result.js...');

var AuthorizationResult = require('../../source/rules/authorization-result.js');
var ResultBase = require('../../source/rules/result-base.js');
var RuleSeverity = require('../../source/rules/rule-severity.js');
var BrokenRule = require('../../source/rules/broken-rule.js');

describe('Authorization result', function () {

  it('constructor expects three non-empty string arguments', function () {
    var build01 = function () { return new AuthorizationResult(); };
    var build02 = function () { return new AuthorizationResult('ruleName'); };
    var build03 = function () { return new AuthorizationResult('ruleName', 'targetName'); };
    var build04 = function () { return new AuthorizationResult('ruleName', 'targetName', 'message'); };
    var build05 = function () { return new AuthorizationResult('', 'targetName', 'message'); };
    var build06 = function () { return new AuthorizationResult('ruleName', '', 'message'); };
    var build07 = function () { return new AuthorizationResult('ruleName', 'targetName', ''); };
    var build08 = function () { return new AuthorizationResult(null, null, null); };
    var build09 = function () { return new AuthorizationResult('ruleName', null, 'message'); };

    expect(build01).toThrow();
    expect(build02).toThrow();
    expect(build03).toThrow();
    expect(build04).not.toThrow();
    expect(build05).toThrow();
    expect(build06).not.toThrow();
    expect(build07).toThrow();
    expect(build08).toThrow();
    expect(build09).not.toThrow();
  });

  it('inherits result base type', function() {
    var result = new AuthorizationResult('ruleName', 'targetName', 'message');

    expect(result).toEqual(jasmine.any(ResultBase));
  });

  it('has six properties', function() {
    var result = new AuthorizationResult('ruleName', 'targetName', 'message');

    expect(result.ruleName).toBe('ruleName');
    expect(result.propertyName).toBe('targetName');
    expect(result.message).toBe('message');
    expect(result.severity).toBe(RuleSeverity.error);
    expect(result.stopsProcessing).toBe(false);
    expect(result.isPreserved).toBe(false);
  });

  it('toBrokenRule method works', function() {
    var result = new AuthorizationResult('ruleName', 'targetName', 'message');
    var broken = result.toBrokenRule();
    broken.isPreserved = true;
    broken.severity = RuleSeverity.information;

    expect(broken).toEqual(jasmine.any(BrokenRule));
    expect(broken.ruleName).toBe('ruleName');
    expect(broken.isPreserved).toBe(true);
    expect(broken.propertyName).toBe('targetName');
    expect(broken.message).toBe('message');
    expect(broken.severity).toBe(RuleSeverity.information);
  });
});
