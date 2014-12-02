console.log('Testing rules/validation-rule.js...');

var ValidationRule = require('../../source/rules/validation-rule.js');
var RuleBase = require('../../source/rules/rule-base.js');
var ValidationResult = require('../../source/rules/validation-result.js');
var RuleSeverity = require('../../source/rules/rule-severity.js');
var PropertyInfo = require('../../source/shared/property-info.js');
var PropertyManager = require('../../source/shared/property-manager.js');
var Text = require('../../source/data-types/text.js');

describe('Validation rule', function () {

  it('constructor expects a non-empty string argument', function () {
    var build01 = function () { return new ValidationRule(); };
    var build02 = function () { return new ValidationRule(null); };
    var build03 = function () { return new ValidationRule(''); };
    var build04 = function () { return new ValidationRule('ruleName'); };
    var build05 = function () { return new ValidationRule(true); };
    var build06 = function () { return new ValidationRule(777); };
    var build07 = function () { return new ValidationRule({}); };
    var build08 = function () { return new ValidationRule(['ruleName']); };

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
    var rule = new ValidationRule('ruleName');

    expect(rule).toEqual(jasmine.any(RuleBase));
  });

  it('has five properties', function() {
    var rule = new ValidationRule('ruleName');

    expect(rule.ruleName).toBe('ruleName');
    expect(rule.primaryProperty).toBeNull();
    expect(rule.message).toBeNull();
    expect(rule.priority).toBe(10);
    expect(rule.stopsProcessing).toBe(false);
  });

  it('initialize method works', function() {
    var rule = new ValidationRule('ruleName');
    var property = new PropertyInfo('property', new Text(), true);
    rule.initialize(property, 'message', 19, true);

    expect(rule.ruleName).toBe('ruleName');
    expect(rule.primaryProperty).toBe(property);
    expect(rule.message).toBe('message');
    expect(rule.priority).toBe(19);
    expect(rule.stopsProcessing).toBe(true);
  });

  it('addInputProperty method expects a property info object', function() {
    var rule = new ValidationRule('ruleName');
    var property = new PropertyInfo('property', new Text(), true);

    var add01 = function () { rule.addInputProperty(); };
    var add02 = function () { rule.addInputProperty(1356.2468); };
    var add03 = function () { rule.addInputProperty(true); };
    var add04 = function () { rule.addInputProperty('property'); };
    var add05 = function () { rule.addInputProperty({ property: property }); };
    var add06 = function () { rule.addInputProperty([ property ]); };
    var add07 = function () { rule.addInputProperty(property); };

    expect(add01).toThrow();
    expect(add02).toThrow();
    expect(add03).toThrow();
    expect(add04).toThrow();
    expect(add05).toThrow();
    expect(add06).toThrow();
    expect(add07).not.toThrow();
  });

  it('addAffectedProperty method expects a property info object', function() {
    var rule = new ValidationRule('ruleName');
    var property = new PropertyInfo('property', new Text(), true);

    var add01 = function () { rule.addAffectedProperty(); };
    var add02 = function () { rule.addAffectedProperty(1356.2468); };
    var add03 = function () { rule.addAffectedProperty(true); };
    var add04 = function () { rule.addAffectedProperty('property'); };
    var add05 = function () { rule.addAffectedProperty({ property: property }); };
    var add06 = function () { rule.addAffectedProperty([ property ]); };
    var add07 = function () { rule.addAffectedProperty(property); };

    expect(add01).toThrow();
    expect(add02).toThrow();
    expect(add03).toThrow();
    expect(add04).toThrow();
    expect(add05).toThrow();
    expect(add06).toThrow();
    expect(add07).not.toThrow();
  });

  it('getInputValues method works', function() {
    var primary = new PropertyInfo('primary', new Text(), true);
    var secondary = new PropertyInfo('secondary', new Text(), true);
    var pm = new PropertyManager('sample');
    var rule = new ValidationRule('ruleName');

    pm.add(primary);
    pm.add(secondary);
    pm.setValue(primary, 'turtle');
    pm.setValue(secondary, 'beach');

    rule.initialize(primary, 'message', 19, true);
    rule.addInputProperty(secondary);

    expect(rule.getInputValues(pm)).toEqual({
      primary: 'turtle',
      secondary: 'beach'
    });
  });

  it('result method works', function() {
    var rule = new ValidationRule('ruleName');
    var primary = new PropertyInfo('primary', new Text(), true);
    var affected = new PropertyInfo('affected', new Text(), true);
    rule.initialize(primary, 'message', 19, true);
    rule.addAffectedProperty(affected);
    var result = rule.result('final message', RuleSeverity.warning);

    expect(result).toEqual(jasmine.any(ValidationResult));
    expect(result.ruleName).toBe('ruleName');
    expect(result.propertyName).toBe('primary');
    expect(result.message).toBe('final message');
    expect(result.severity).toBe(RuleSeverity.warning);
    expect(result.stopsProcessing).toBe(true);
    expect(result.isPreserved).toBe(false);
    expect(result.affectedProperties).toEqual([ affected ]);
  });
});
