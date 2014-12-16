console.log('Testing common-rules/dependency-rule.js...');

var DependencyRule = require('../../source/common-rules/dependency-rule.js');
var PropertyInfo = require('../../source/shared/property-info.js');
var F = require('../../source/shared/property-flag.js');
var Text = require('../../source/data-types/text.js');
var ValidationRule = require('../../source/rules/validation-rule.js');
var ValidationResult = require('../../source/rules/validation-result.js');
var RuleSeverity = require('../../source/rules/rule-severity.js');

describe('Dependency rule', function () {
  var pi = new PropertyInfo('property', new Text(), F.key);
  var di = new PropertyInfo('dependent', new Text());
  var di2 = new PropertyInfo('calculated', new Text(), F.readOnly);

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
    var rule1 = new DependencyRule(pi, di, 'message #1', 7, true);
    //var ap1 = rule1.getAffectedProperties();
    var rule2 = new DependencyRule(pi, di2, 'message #2', 7, false);
    //var ap2 = rule2.getAffectedProperties();

    var call01 = function () { rule1.execute(); };
    var result01 = rule1.execute({ property: null });
    var result02 = rule1.execute({ property: '' });
    var result03 = rule1.execute({ property: 'value' });

    expect(call01).toThrow();
    expect(result01).toBeUndefined();
    expect(result02).toBeUndefined();

    expect(result03).toEqual(jasmine.any(ValidationResult));

    expect(result03.ruleName).toBe('Dependency');
    expect(result03.propertyName).toBe('property');
    expect(result03.message).toBe('message #1');
    expect(result03.severity).toBe(RuleSeverity.success);
    expect(result03.stopsProcessing).toBe(true);
    expect(result03.isPreserved).toBe(false);
    expect(result03.affectedProperties.length).toBe(1);
    expect(result03.affectedProperties[0]).toBe(di);

    var call02 = function () { rule2.execute(); };
    var result04 = rule2.execute({ property: null });
    var result05 = rule2.execute({ property: '' });
    var result06 = rule2.execute({ property: 'value' });

    expect(call02).toThrow();
    expect(result04).toBeUndefined();
    expect(result05).toBeUndefined();

    expect(result06).toEqual(jasmine.any(ValidationResult));

    expect(result06.ruleName).toBe('Dependency');
    expect(result06.propertyName).toBe('property');
    expect(result06.message).toBe('message #2');
    expect(result06.severity).toBe(RuleSeverity.success);
    expect(result06.stopsProcessing).toBe(false);
    expect(result06.isPreserved).toBe(false);
    expect(result06.affectedProperties.length).toBe(1);
    expect(result06.affectedProperties[0]).toBe(di2);
  });
});
