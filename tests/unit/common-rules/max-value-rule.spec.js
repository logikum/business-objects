console.log('Testing common-rules/max-value-rule.js...');

var MaxValueRule = require('../../../source/common-rules/max-value-rule.js');
var PropertyInfo = require('../../../source/shared/property-info.js');
var Text = require('../../../source/data-types/text.js');
var ValidationRule = require('../../../source/rules/validation-rule.js');
var ValidationResult = require('../../../source/rules/validation-result.js');
var RuleSeverity = require('../../../source/rules/rule-severity.js');

describe('Max-value rule', function () {
  var pi = new PropertyInfo('property', new Text());

  it('constructor expects two-to-five arguments', function () {
    var build01 = function () { return new MaxValueRule(); };
    var build02 = function () { return new MaxValueRule(512); };
    var build03 = function () { return new MaxValueRule('property'); };
    var build04 = function () { return new MaxValueRule(pi); };
    var build05 = function () { return new MaxValueRule(pi, 1024); };
    var build06 = function () { return new MaxValueRule(pi, 1024, 'message'); };
    var build07 = function () { return new MaxValueRule(pi, 1024, 'message', 13); };
    var build08 = function () { return new MaxValueRule(pi, 1024, 'message', 13, true); };

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
    var rule = new MaxValueRule(pi, 1024, 'message', 13, true);

    expect(rule).toEqual(jasmine.any(ValidationRule));
  });

  it('has four properties', function () {
    var rule = new MaxValueRule(pi, 1024, 'message', 13, true);

    expect(rule.ruleName).toBe('MaxValue');
    expect(rule.message).toBe('message');
    expect(rule.priority).toBe(13);
    expect(rule.stopsProcessing).toBe(true);
  });

  it('execute method works', function() {
    var rule = new MaxValueRule(pi, 1024, 'message', 13, true);

    var call01 = function () { rule.execute(); };
    var result01 = rule.execute({ property: -1 });
    var result02 = rule.execute({ property: 0 });
    var result03 = rule.execute({ property: 1 });
    var result04 = rule.execute({ property: 1023 });
    var result05 = rule.execute({ property: 1024 });
    var result06 = rule.execute({ property: 1025 });
    var result07 = rule.execute({ property: 2000 });

    expect(call01).toThrow();
    expect(result01).toBeUndefined();
    expect(result02).toBeUndefined();
    expect(result03).toBeUndefined();
    expect(result04).toBeUndefined();
    expect(result05).toBeUndefined();

    expect(result06).toEqual(jasmine.any(ValidationResult));
    expect(result07).toEqual(jasmine.any(ValidationResult));

    expect(result06.ruleName).toBe('MaxValue');
    expect(result06.propertyName).toBe('property');
    expect(result06.message).toBe('message');
    expect(result06.severity).toBe(RuleSeverity.error);
    expect(result06.stopsProcessing).toBe(true);
    expect(result06.isPreserved).toBe(false);
    expect(result06.affectedProperties.length).toBe(0);
  });
});
