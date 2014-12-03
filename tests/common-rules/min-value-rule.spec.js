console.log('Testing common-rules/min-value-rule.js...');

var MinValueRule = require('../../source/common-rules/min-value-rule.js');
var PropertyInfo = require('../../source/shared/property-info.js');
var Text = require('../../source/data-types/text.js');
var ValidationRule = require('../../source/rules/validation-rule.js');
var ValidationResult = require('../../source/rules/validation-result.js');
var RuleSeverity = require('../../source/rules/rule-severity.js');

describe('Min-value rule', function () {
  var pi = new PropertyInfo('property', new Text(), true);

  it('constructor expects two-to-five arguments', function () {
    var build01 = function () { return new MinValueRule(); };
    var build02 = function () { return new MinValueRule(512); };
    var build03 = function () { return new MinValueRule('property'); };
    var build04 = function () { return new MinValueRule(pi); };
    var build05 = function () { return new MinValueRule(pi, 128); };
    var build06 = function () { return new MinValueRule(pi, 128, 'message'); };
    var build07 = function () { return new MinValueRule(pi, 128, 'message', 13); };
    var build08 = function () { return new MinValueRule(pi, 128, 'message', 13, true); };

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
    var rule = new MinValueRule(pi, 128, 'message', 13, true);

    expect(rule).toEqual(jasmine.any(ValidationRule));
  });

  it('has four properties', function () {
    var rule = new MinValueRule(pi, 128, 'message', 13, true);

    expect(rule.ruleName).toBe('MinValue');
    expect(rule.message).toBe('message');
    expect(rule.priority).toBe(13);
    expect(rule.stopsProcessing).toBe(true);
  });

  it('execute method works', function() {
    var rule = new MinValueRule(pi, 128, 'message', 13, true);

    var call01 = function () { rule.execute(); };
    var result01 = rule.execute({ property: -1 });
    var result02 = rule.execute({ property: 0 });
    var result03 = rule.execute({ property: 1 });
    var result04 = rule.execute({ property: 127 });
    var result05 = rule.execute({ property: 128 });
    var result06 = rule.execute({ property: 129 });
    var result07 = rule.execute({ property: 500 });

    expect(call01).toThrow();
    expect(result01).toEqual(jasmine.any(ValidationResult));
    expect(result02).toEqual(jasmine.any(ValidationResult));
    expect(result03).toEqual(jasmine.any(ValidationResult));
    expect(result04).toEqual(jasmine.any(ValidationResult));

    expect(result05).toBeUndefined();
    expect(result06).toBeUndefined();
    expect(result07).toBeUndefined();

    expect(result01.ruleName).toBe('MinValue');
    expect(result01.propertyName).toBe('property');
    expect(result01.message).toBe('message');
    expect(result01.severity).toBe(RuleSeverity.error);
    expect(result01.stopsProcessing).toBe(true);
    expect(result01.isPreserved).toBe(false);
    expect(result01.affectedProperties.length).toBe(0);
  });
});
