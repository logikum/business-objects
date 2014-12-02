console.log('Testing rules/broken-rule.js...');

var BrokenRule = require('../../source/rules/broken-rule.js');
var RuleSeverity = require('../../source/rules/rule-severity.js');

describe('Broken rule', function () {

  it('constructor expects five arguments', function () {
    var build01 = function () { return new BrokenRule(); };
    var build02 = function () { return new BrokenRule('name'); };
    var build03 = function () { return new BrokenRule('name', true); };
    var build04 = function () { return new BrokenRule('name', false, 'property'); };
    var build05 = function () { return new BrokenRule('name', true, 'property', 'message'); };
    var build06 = function () { return new BrokenRule('name', false, 'property', 'message', RuleSeverity.error); };
    var build07 = function () { return new BrokenRule('name', false, 'property', 'message', RuleSeverity.success); };
    var build08 = function () { return new BrokenRule(1, 2, 3, 4, 5); };
    var build09 = function () { return new BrokenRule('name', null, null, 'message'); };

    expect(build01).toThrow();
    expect(build02).toThrow();
    expect(build03).toThrow();
    expect(build04).toThrow();
    expect(build05).not.toThrow();
    expect(build06).not.toThrow();
    expect(build07).not.toThrow();
    expect(build08).toThrow();
    expect(build09).not.toThrow();
  });

  it('has five properties', function() {
    var br = new BrokenRule('name', false, 'property', 'message', RuleSeverity.success);

    expect(br.ruleName).toBe('name');
    expect(br.isPreserved).toBe(false);
    expect(br.propertyName).toBe('property');
    expect(br.message).toBe('message');
    expect(br.severity).toBe(RuleSeverity.success);
  });
});
