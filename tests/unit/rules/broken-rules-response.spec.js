console.log('Testing rules/validation-response.js...');

var BrokenRulesResponse = require('../../../source/rules/broken-rules-response.js');
var BrokenRulesOutput = require('../../../source/rules/broken-rules-output.js');
var RuleNotice = require('../../../source/rules/rule-notice.js');
var RuleSeverity = require('../../../source/rules/rule-severity.js');

describe('Broken rules response', function () {
  var bro = new BrokenRulesOutput();
  bro.add('property', new RuleNotice('message #1', RuleSeverity.information));
  bro.add('property', new RuleNotice('message #2', RuleSeverity.error));

  it('constructor expects one or two arguments', function () {
    var build01 = function () { return new BrokenRulesResponse(); };
    var build02 = function () { return new BrokenRulesResponse({}); };
    var build03 = function () { return new BrokenRulesResponse(bro); };
    var build04 = function () { return new BrokenRulesResponse(bro, 2); };
    var build05 = function () { return new BrokenRulesResponse(bro, 'Something is wrong.'); };

    expect(build01).toThrow();
    expect(build02).toThrow();
    expect(build03).not.toThrow();
    expect(build04).toThrow();
    expect(build05).not.toThrow();
  });

  it('has five properties', function() {
    var brr = new BrokenRulesResponse(bro, 'Something is wrong.');

    expect(brr.name).toBe('BrokenRules');
    expect(brr.status).toBe(422);
    expect(brr.message).toBe('Something is wrong.');
    expect(brr.data).toEqual(jasmine.any(Object));
    expect(brr.data.property).toEqual(jasmine.any(Array));
    expect(brr.data.property.length).toBe(2);
    expect(brr.data.property[0].message).toBe('message #1');
    expect(brr.data.property[0].severity).toBe(RuleSeverity.information);
    expect(brr.count).toBe(2);
  });

  it('has read.only properties', function() {
    var brr = new BrokenRulesResponse(bro, 'Something is wrong.');
    brr.name = 'name';
    brr.status = 404;
    brr.message = 'Good bye!';
    brr.data = { first: true, second : 2 };
    brr.count = 33;

    expect(brr.name).toBe('BrokenRules');
    expect(brr.status).toBe(422);
    expect(brr.message).toBe('Something is wrong.');
    expect(brr.data).toEqual(jasmine.any(Object));
    expect(brr.data.property).toEqual(jasmine.any(Array));
    expect(brr.data.property.length).toBe(2);
    expect(brr.data.property[1].message).toBe('message #2');
    expect(brr.data.property[1].severity).toBe(RuleSeverity.error);
    expect(brr.count).toBe(2);
  });
});
