console.log('Testing rules/result-base.js...');

var ResultBase = require('../../source/rules/result-base.js');
var RuleSeverity = require('../../source/rules/rule-severity.js');
var BrokenRule = require('../../source/rules/broken-rule.js');

describe('Rule base', function () {
  var rb = new ResultBase();

  it('has six properties', function() {

    expect(rb.ruleName).toBeNull();
    expect(rb.propertyName).toBeNull();
    expect(rb.message).toBeNull();
    expect(rb.severity).toBe(RuleSeverity.error);
    expect(rb.stopsProcessing).toBe(false);
    expect(rb.isPreserved).toBe(false);
  });

  it('toBrokenRule method works', function() {
    rb.ruleName = 'rule name';
    rb.message = 'message';
    var broken = rb.toBrokenRule();

    expect(broken).toEqual(jasmine.any(BrokenRule));
  });
});
