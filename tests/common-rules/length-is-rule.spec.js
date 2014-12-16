console.log('Testing common-rules/length-is-rule.js...');

var LengthIsRule = require('../../source/common-rules/length-is-rule.js');
var PropertyInfo = require('../../source/shared/property-info.js');
var Text = require('../../source/data-types/text.js');
var ValidationRule = require('../../source/rules/validation-rule.js');
var ValidationResult = require('../../source/rules/validation-result.js');
var RuleSeverity = require('../../source/rules/rule-severity.js');

describe('Length-is rule', function () {
  var pi = new PropertyInfo('property', new Text());

  it('constructor expects two-to-five arguments', function () {
    var build01 = function () { return new LengthIsRule(); };
    var build02 = function () { return new LengthIsRule(51); };
    var build03 = function () { return new LengthIsRule('property'); };
    var build04 = function () { return new LengthIsRule(pi); };
    var build05 = function () { return new LengthIsRule(pi, 8); };
    var build06 = function () { return new LengthIsRule(pi, 8, 'message'); };
    var build07 = function () { return new LengthIsRule(pi, 8, 'message', 20); };
    var build08 = function () { return new LengthIsRule(pi, 8, 'message', 20, true); };

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
    var rule = new LengthIsRule(pi, 8, 'message', 20, true);

    expect(rule).toEqual(jasmine.any(ValidationRule));
  });

  it('has four properties', function () {
    var rule = new LengthIsRule(pi, 8, 'message', 20, true);

    expect(rule.ruleName).toBe('LengthIs');
    expect(rule.message).toBe('message');
    expect(rule.priority).toBe(20);
    expect(rule.stopsProcessing).toBe(true);
  });

  it('execute method works', function() {
    var rule = new LengthIsRule(pi, 8, 'message', 20, true);

    var call01 = function () { rule.execute(); };
    var result01 = rule.execute({ property: 'New York' });
    var result02 = rule.execute({ property: '' });
    var result03 = rule.execute({ property: 'London' });
    var result04 = rule.execute({ property: 'Buenos Aires' });

    expect(call01).toThrow();
    expect(result01).toBeUndefined();

    expect(result02).toEqual(jasmine.any(ValidationResult));
    expect(result03).toEqual(jasmine.any(ValidationResult));
    expect(result04).toEqual(jasmine.any(ValidationResult));

    expect(result02.ruleName).toBe('LengthIs');
    expect(result02.propertyName).toBe('property');
    expect(result02.message).toBe('message');
    expect(result02.severity).toBe(RuleSeverity.error);
    expect(result02.stopsProcessing).toBe(true);
    expect(result02.isPreserved).toBe(false);
    expect(result02.affectedProperties.length).toBe(0);
  });
});
