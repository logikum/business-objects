console.log('Testing common-rules/required-rule.js...');

var RequiredRule = require('../../../source/common-rules/required-rule.js');
var PropertyInfo = require('../../../source/shared/property-info.js');
var Text = require('../../../source/data-types/text.js');
var ValidationRule = require('../../../source/rules/validation-rule.js');
var ValidationResult = require('../../../source/rules/validation-result.js');
var RuleSeverity = require('../../../source/rules/rule-severity.js');

describe('Required rule', function () {
  var pi = new PropertyInfo('property', new Text());

  it('constructor expects one-to-four arguments', function () {
    var build01 = function () { return new RequiredRule(); };
    var build02 = function () { return new RequiredRule(51); };
    var build03 = function () { return new RequiredRule('property'); };
    var build04 = function () { return new RequiredRule({ property: 'name' }); };
    var build05 = function () { return new RequiredRule(pi); };
    var build06 = function () { return new RequiredRule(pi, 'message'); };
    var build07 = function () { return new RequiredRule(pi, 'message', 100); };
    var build08 = function () { return new RequiredRule(pi, 'message', 100, true); };

    expect(build01).toThrow();
    expect(build02).toThrow();
    expect(build03).toThrow();
    expect(build04).toThrow();
    expect(build05).not.toThrow();
    expect(build06).not.toThrow();
    expect(build07).not.toThrow();
    expect(build08).not.toThrow();
  });

  it('inherits validation rule type', function() {
    var rule = new RequiredRule(pi, 'message', 100, true);

    expect(rule).toEqual(jasmine.any(ValidationRule));
  });

  it('has four properties', function () {
    var rule = new RequiredRule(pi, 'message', 100, true);

    expect(rule.ruleName).toBe('Required');
    expect(rule.message).toBe('message');
    expect(rule.priority).toBe(100);
    expect(rule.stopsProcessing).toBe(true);
  });

  it('execute method works', function() {
    var rule = new RequiredRule(pi, 'message', 100, true);

    var call01 = function () { rule.execute(); };
    var result01 = rule.execute({ property: 'Hello!' });
    var result02 = rule.execute({ property: '' });

    expect(call01).toThrow();
    expect(result01).toBeUndefined();

    expect(result02).toEqual(jasmine.any(ValidationResult));
    expect(result02.ruleName).toBe('Required');
    expect(result02.propertyName).toBe('property');
    expect(result02.message).toBe('message');
    expect(result02.severity).toBe(RuleSeverity.error);
    expect(result02.stopsProcessing).toBe(true);
    expect(result02.isPreserved).toBe(false);
    expect(result02.affectedProperties.length).toBe(0);
  });
});
