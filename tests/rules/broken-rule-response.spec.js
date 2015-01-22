console.log('Testing rules/broken-rule-response.js...');

var BrokenRuleResponse = require('../../source/rules/broken-rule-response.js');
var RuleSeverity = require('../../source/rules/rule-severity.js');

describe('Broken rule response', function () {

  it('constructor expects no argument', function () {
    var build01 = function () { return new BrokenRuleResponse(); };

    expect(build01).not.toThrow();
  });

  it('add method expects two non-empty string and a severity argument', function() {
    var brs = new BrokenRuleResponse();

    var add01 = function () { brs.add(); };
    var add02 = function () { brs.add('property'); };
    var add03 = function () { brs.add('property', 'message'); };
    var add04 = function () { brs.add('property', 'message', RuleSeverity.error); };
    var add05 = function () { brs.add('', 'message', RuleSeverity.error); };
    var add06 = function () { brs.add('property', '', RuleSeverity.error); };
    var add07 = function () { brs.add('property', 'message', 3); };
    var add08 = function () { brs.add(null, null, RuleSeverity.error); };

    expect(add01).toThrow();
    expect(add02).toThrow();
    expect(add03).toThrow();
    expect(add04).not.toThrow();
    expect(add05).toThrow();
    expect(add06).toThrow();
    expect(add07).not.toThrow();
    expect(add08).toThrow();
  });

  it('add method creates an array property', function() {
    var brs = new BrokenRuleResponse();
    brs.add('property', 'message #1', RuleSeverity.information);
    brs.add('property', 'message #2', RuleSeverity.error);

    expect(brs.property).toEqual(jasmine.any(Array));
    expect(brs.property[0].message).toBe('message #1');
    expect(brs.property[0].severity).toBe(RuleSeverity.information);
    expect(brs.property[1].message).toBe('message #2');
    expect(brs.property[1].severity).toBe(RuleSeverity.error);
  });
});
