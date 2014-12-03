console.log('Testing common-rules/dependency-rule.js...');

var DependencyRule = require('../../source/common-rules/dependency-rule.js');
var PropertyInfo = require('../../source/shared/property-info.js');
var Text = require('../../source/data-types/text.js');
var ValidationRule = require('../../source/rules/validation-rule.js');
var ValidationResult = require('../../source/rules/validation-result.js');
var RuleSeverity = require('../../source/rules/rule-severity.js');

describe('Max-value rule', function () {
  var pi = new PropertyInfo('property', new Text(), true);
  var di = new PropertyInfo('dependent', new Text());
  var di2 = new PropertyInfo('calculated', new Text(), false);

  it('constructor expects two-to-five arguments', function () {
    var build01 = function () { return new DependencyRule(); };
    var build02 = function () { return new DependencyRule(true); };
    var build03 = function () { return new DependencyRule('property'); };
    var build04 = function () { return new DependencyRule(pi); };
    var build05 = function () { return new DependencyRule(pi, di); };
    var build06 = function () { return new DependencyRule(pi, di, 'message'); };
    var build07 = function () { return new DependencyRule(pi, di, 'message', 7); };
    var build08 = function () { return new DependencyRule(pi, di, 'message', 7, true); };
    var build09 = function () { return new DependencyRule(pi, [di, di2], 'message', 7, true); };

    expect(build01).toThrow();
    expect(build02).toThrow();
    expect(build03).toThrow();
    expect(build04).toThrow();
    expect(build05).not.toThrow();
    expect(build06).not.toThrow();
    expect(build07).not.toThrow();
    expect(build08).not.toThrow();
    expect(build09).not.toThrow();
  });

  it('inherits validation rule type', function() {
    var rule = new DependencyRule(pi, di, 'message', 7, true);

    expect(rule).toEqual(jasmine.any(ValidationRule));
  });

  it('has four properties', function () {
    var rule = new DependencyRule(pi, di, 'message', 7, true);

    expect(rule.ruleName).toBe('Dependency');
    expect(rule.message).toBe('message');
    expect(rule.priority).toBe(7);
    expect(rule.stopsProcessing).toBe(true);
  });

  it('execute method works', function() {
    var rule = new DependencyRule(pi, di, 'message', 7, true);
    var ap = rule.getAffectedProperties();
    var rule2 = new DependencyRule(pi, di2, 'message', 7, true);
    var ap2 = rule.getAffectedProperties();

    var call01 = function () { rule.execute(); };
    var result01 = rule.execute({ property: null });
    var result02 = rule.execute({ property: '' });
    var result03 = rule.execute({ property: 'z' });
    var result04 = rule.execute({ property: 'value' });

    expect(call01).toThrow();
    expect(result03).toBeUndefined();
    expect(result04).toBeUndefined();

    expect(result01).toEqual(jasmine.any(ValidationResult));
    expect(result02).toEqual(jasmine.any(ValidationResult));

    expect(result02.ruleName).toBe('Dependency');
    expect(result02.propertyName).toBe('property');
    expect(result02.message).toBe('message');
    expect(result02.severity).toBe(RuleSeverity.error);
    expect(result02.stopsProcessing).toBe(true);
    expect(result02.isPreserved).toBe(false);
    expect(result02.affectedProperties.length).toBe(1);
    expect(result02.affectedProperties[0]).toBe(di);
  });
});
