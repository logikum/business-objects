console.log('Testing rules/validation-result.js...');

var ValidationResult = require('../../../source/rules/validation-result.js');
var ResultBase = require('../../../source/rules/result-base.js');
var RuleSeverity = require('../../../source/rules/rule-severity.js');
var BrokenRule = require('../../../source/rules/broken-rule.js');

describe('Validation result', function () {

  it('constructor expects three non-empty string arguments', function () {
    var build01 = function () { return new ValidationResult(); };
    var build02 = function () { return new ValidationResult('ruleName'); };
    var build03 = function () { return new ValidationResult('ruleName', 'propertyName'); };
    var build04 = function () { return new ValidationResult('ruleName', 'propertyName', 'message'); };
    var build05 = function () { return new ValidationResult('', 'propertyName', 'message'); };
    var build06 = function () { return new ValidationResult('ruleName', '', 'message'); };
    var build07 = function () { return new ValidationResult('ruleName', 'propertyName', ''); };
    var build08 = function () { return new ValidationResult(null, null, null); };

    expect(build01).toThrow();
    expect(build02).toThrow();
    expect(build03).toThrow();
    expect(build04).not.toThrow();
    expect(build05).toThrow();
    expect(build06).toThrow();
    expect(build07).toThrow();
    expect(build08).toThrow();
  });

  it('inherits result base type', function() {
    var result = new ValidationResult('ruleName', 'propertyName', 'message');

    expect(result).toEqual(jasmine.any(ResultBase));
  });

  it('has seven properties', function() {
    var result = new ValidationResult('ruleName', 'propertyName', 'message');

    expect(result.ruleName).toBe('ruleName');
    expect(result.propertyName).toBe('propertyName');
    expect(result.message).toBe('message');
    expect(result.severity).toBe(RuleSeverity.error);
    expect(result.stopsProcessing).toBe(false);
    expect(result.isPreserved).toBe(false);
    expect(result.affectedProperties).toBeNull();
  });

  it('toBrokenRule method works', function() {
    var result = new ValidationResult('ruleName', 'propertyName', 'message');
    var broken = result.toBrokenRule();
    broken.isPreserved = true;
    broken.severity = RuleSeverity.information;

    expect(broken).toEqual(jasmine.any(BrokenRule));
    expect(broken.ruleName).toBe('ruleName');
    expect(broken.isPreserved).toBe(true);
    expect(broken.propertyName).toBe('propertyName');
    expect(broken.message).toBe('message');
    expect(broken.severity).toBe(RuleSeverity.information);
  });
});
