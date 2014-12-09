console.log('Testing common-rules/information-rule.js...');

var InformationRule = require('../../source/common-rules/information-rule.js');
var PropertyInfo = require('../../source/shared/property-info.js');
var Text = require('../../source/data-types/text.js');
var ValidationRule = require('../../source/rules/validation-rule.js');
var ValidationResult = require('../../source/rules/validation-result.js');
var RuleSeverity = require('../../source/rules/rule-severity.js');

describe('Information rule', function () {
  var pi = new PropertyInfo('property', new Text(), true);

  it('constructor expects two-to-four arguments', function () {
    var build01 = function () { return new InformationRule(); };
    var build02 = function () { return new InformationRule(2048); };
    var build03 = function () { return new InformationRule('property'); };
    var build04 = function () { return new InformationRule({ property: 'name' }); };
    var build05 = function () { return new InformationRule(pi); };
    var build06 = function () { return new InformationRule(pi, 'message'); };
    var build07 = function () { return new InformationRule(pi, 'message', 3); };
    var build08 = function () { return new InformationRule(pi, 'message', 3, false); };

    expect(build01).toThrow();
    expect(build02).toThrow();
    expect(build03).toThrow();
    expect(build04).toThrow();
    expect(build05).toThrow();
    expect(build06).not.toThrow();
    expect(build07).not.toThrow();
    expect(build08).not.toThrow();
  });

  it('inherits validation rule type', function() {
    var rule = new InformationRule(pi, 'message', 3, false);

    expect(rule).toEqual(jasmine.any(ValidationRule));
  });

  it('has four properties', function () {
    var rule = new InformationRule(pi, 'message', 3, false);

    expect(rule.ruleName).toBe('Information');
    expect(rule.message).toBe('message');
    expect(rule.priority).toBe(3);
    expect(rule.stopsProcessing).toBe(false);
  });

  it('execute method works', function() {
    var rule = new InformationRule(pi, 'message', 3, false);

    var result01 = rule.execute();
    var result02 = rule.execute({ property: '' });
    var result03 = rule.execute({ property: 'Welcome!' });

    expect(result01).toEqual(jasmine.any(ValidationResult));
    expect(result02).toEqual(jasmine.any(ValidationResult));
    expect(result03).toEqual(jasmine.any(ValidationResult));

    expect(result03.ruleName).toBe('Information');
    expect(result03.propertyName).toBe('property');
    expect(result03.message).toBe('message');
    expect(result03.severity).toBe(RuleSeverity.information);
    expect(result03.stopsProcessing).toBe(false);
    expect(result03.isPreserved).toBe(false);
    expect(result03.affectedProperties.length).toBe(0);
  });
});
