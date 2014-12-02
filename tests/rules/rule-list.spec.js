console.log('Testing rules/rule-list.js...');

var RuleList = require('../../source/rules/rule-list.js');
var Rule = require('../../source/rules/rule-base.js');

describe('Rule list', function () {

  it('constructor expects no argument', function () {
    var build01 = function () { return new RuleList(); };

    expect(build01).not.toThrow();
  });

  it('add method expects a non-empty string and a rule argument', function() {
    var rl = new RuleList();
    var rule = new Rule();
    rule.initialize('message', 13, true);

    var add01 = function () { rl.add(); };
    var add02 = function () { rl.add('property'); };
    var add03 = function () { rl.add('property', 'message'); };
    var add04 = function () { rl.add('property', rule); };
    var add05 = function () { rl.add('', rule); };
    var add06 = function () { rl.add(null, rule); };

    expect(add01).toThrow();
    expect(add02).toThrow();
    expect(add03).toThrow();
    expect(add04).not.toThrow();
    expect(add05).toThrow();
    expect(add06).toThrow();
  });

  it('add method creates an array property', function() {
    var rl = new RuleList();
    var rule1 = new Rule();
    rule1.initialize('message #1', 7, false);
    var rule2 = new Rule();
    rule2.initialize('message #2', 13, true);
    rl.add('property', rule1);
    rl.add('property', rule2);

    expect(rl.property).toEqual(jasmine.any(Array));
    expect(rl.property[0].message).toBe('message #1');
    expect(rl.property[0].priority).toBe(7);
    expect(rl.property[0].stopsProcessing).toBe(false);
    expect(rl.property[1].message).toBe('message #2');
    expect(rl.property[1].priority).toBe(13);
    expect(rl.property[1].stopsProcessing).toBe(true);
  });

  it('sort method arranges items by priority', function() {
    var rl = new RuleList();
    var rule1 = new Rule();
    rule1.initialize('message #1', 7, false);
    var rule2 = new Rule();
    rule2.initialize('message #2', 13, true);
    rl.add('property', rule1);
    rl.add('property', rule2);
    rl.sort();

    expect(rl.property[0].message).toBe('message #2');
    expect(rl.property[1].message).toBe('message #1');
  });
});
