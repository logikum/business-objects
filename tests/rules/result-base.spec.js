console.log('Testing rules/result-base.js...');

var ResultBase = require('../../source/rules/result-base.js');
var RuleSeverity = require('../../source/rules/rule-severity.js');
var BrokenRule = require('../../source/rules/broken-rule.js');

describe('Rule base', function () {
  var rb = new ResultBase('rule', 'property', 'message');

  it('has six properties', function() {

    expect(rb.ruleName).toBe('rule');
    expect(rb.propertyName).toBe('property');
    expect(rb.message).toBe('message');
    expect(rb.severity).toBe(RuleSeverity.error);
    expect(rb.stopsProcessing).toBe(false);
    expect(rb.isPreserved).toBe(false);
  });

  it('toBrokenRule method works', function() {
    //rb.ruleName = 'rule name';
    //rb.message = 'message';
    var broken = rb.toBrokenRule();

    expect(broken).toEqual(jasmine.any(BrokenRule));
    expect(broken.ruleName).toBe('rule');
    expect(broken.isPreserved).toBe(false);
    expect(broken.propertyName).toBe('property');
    expect(broken.message).toBe('message');
    expect(broken.severity).toBe(RuleSeverity.error);
  });
});
