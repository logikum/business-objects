console.log('Testing common-rules/expression-rule.js...');

var ExpressionRule = require('../../../source/common-rules/expression-rule.js');
var NullResultOption = require('../../../source/common-rules/null-result-option.js');
var PropertyInfo = require('../../../source/shared/property-info.js');
var Text = require('../../../source/data-types/text.js');
var ValidationRule = require('../../../source/rules/validation-rule.js');
var ValidationResult = require('../../../source/rules/validation-result.js');
var RuleSeverity = require('../../../source/rules/rule-severity.js');

describe('Expression rule', function () {
  var pi = new PropertyInfo('property', new Text());
  var re = new RegExp('[-+]?[0-9]*\.?[0-9]+', 'g');

  it('constructor expects three-to-six arguments', function () {
    var build01 = function () { return new ExpressionRule(); };
    var build02 = function () { return new ExpressionRule(true); };
    var build03 = function () { return new ExpressionRule(pi); };
    var build04 = function () { return new ExpressionRule(pi, re); };
    var build05 = function () { return new ExpressionRule(pi, re, true); };
    var build06 = function () { return new ExpressionRule(pi, re, NullResultOption.returnFalse); };
    var build07 = function () { return new ExpressionRule(pi, re, NullResultOption.returnFalse, 'message'); };
    var build08 = function () { return new ExpressionRule(pi, re, NullResultOption.returnFalse, 'message', 30); };
    var build09 = function () { return new ExpressionRule(pi, re, NullResultOption.returnFalse, 'message', 30, true); };
    var build10 = function () { return new ExpressionRule(pi, re, NullResultOption.returnFalse, 'message', 30, true); };


    expect(build01).toThrow();
    expect(build02).toThrow();
    expect(build03).toThrow();
    expect(build04).toThrow();
    expect(build05).toThrow('The option argument of ExpressionRule constructor must be a NullResultOption item.');
    expect(build06).not.toThrow();
    expect(build07).not.toThrow();
    expect(build08).not.toThrow();
    expect(build09).not.toThrow();
    expect(build10).not.toThrow();
  });

  it('inherits validation rule type', function() {
    var rule = new ExpressionRule(pi, re, NullResultOption.returnFalse, 'message', 30, true);

    expect(rule).toEqual(jasmine.any(ValidationRule));
  });

  it('has four properties', function () {
    var rule = new ExpressionRule(pi, re, NullResultOption.returnFalse, 'message', 30, true);

    expect(rule.ruleName).toBe('Expression');
    expect(rule.message).toBe('message');
    expect(rule.priority).toBe(30);
    expect(rule.stopsProcessing).toBe(true);
  });

  it('execute method works', function() {
    var rule = new ExpressionRule(pi, re, NullResultOption.returnFalse, 'message', 30, true);

    var call01 = function () { rule.execute(); };
    var result01 = rule.execute({ property: '' });
    var result02 = rule.execute({ property: '12.56' });
    var result03 = rule.execute({ property: '  -102.987 ' });
    var result04 = rule.execute({ property: 'The price is $49.99.' });

    expect(call01).toThrow();
    expect(result02).toBeUndefined();
    expect(result03).toBeUndefined();
    expect(result04).toBeUndefined();

    expect(result01).toEqual(jasmine.any(ValidationResult));
    expect(result01.ruleName).toBe('Expression');
    expect(result01.propertyName).toBe('property');
    expect(result01.message).toBe('message');
    expect(result01.severity).toBe(RuleSeverity.error);
    expect(result01.stopsProcessing).toBe(true);
    expect(result01.isPreserved).toBe(false);
    expect(result01.affectedProperties.length).toBe(0);
  });
});
