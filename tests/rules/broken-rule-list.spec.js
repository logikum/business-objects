console.log('Testing main.js...');

var BrokenRuleList = require('../../source/rules/broken-rule-list.js');
var BrokenRule = require('../../source/rules/broken-rule.js');
var RuleSeverity = require('../../source/rules/rule-severity.js');
var PropertyInfo = require('../../source/shared/property-info.js');
var Text = require('../../source/data-types/text.js');

describe('Broken rule list', function () {

  it('constructor expects a non-empty string argument', function () {
    var build01 = function () { return new BrokenRuleList(); };
    var build02 = function () { return new BrokenRuleList(1.234); };
    var build03 = function () { return new BrokenRuleList(true); };
    var build04 = function () { return new BrokenRuleList(''); };
    var build05 = function () { return new BrokenRuleList(null); };
    var build06 = function () { return new BrokenRuleList({}); };
    var build07 = function () { return new BrokenRuleList([]); };
    var build08 = function () { return new BrokenRuleList('model'); };

    expect(build01).toThrow();
    expect(build02).toThrow();
    expect(build03).toThrow();
    expect(build04).toThrow();
    expect(build05).toThrow();
    expect(build06).toThrow();
    expect(build07).toThrow();
    expect(build08).not.toThrow();
  });

  it('add method expects a broken rule argument', function() {
    var brl = new BrokenRuleList('model');
    var br = new BrokenRule('name', false, 'property', 'message', RuleSeverity.error);

    var add01 = function () { brl.add(); };
    var add02 = function () { brl.add('property'); };
    var add03 = function () { brl.add('property', 'message'); };
    var add04 = function () { brl.add('property', br); };
    var add05 = function () { brl.add(br); };

    expect(add01).toThrow();
    expect(add02).toThrow();
    expect(add03).toThrow();
    expect(add04).toThrow();
    expect(add05).not.toThrow();
  });

  it('isValid method works', function() {
    var brl1 = new BrokenRuleList('model');
    var br1 = new BrokenRule('name #1', false, 'property', 'message #1', RuleSeverity.success);
    brl1.add(br1);
    var brl2 = new BrokenRuleList('model');
    var br2 = new BrokenRule('name #2', true, 'property', 'message #2', RuleSeverity.error);
    brl2.add(br2);

    expect(brl1.isValid()).toBe(true);
    expect(brl2.isValid()).toBe(false);
  });

  it('output method converts broken rules', function() {
    var brl = new BrokenRuleList('model');
    var br1 = new BrokenRule('name #1', false, 'property1', 'message #1', RuleSeverity.warning);
    var br2 = new BrokenRule('name #2', true, 'property2', 'message #2', RuleSeverity.error);
    brl.add(br1);
    brl.add(br2);
    var brs = brl.output();

    expect(brs['model.property1']).toEqual(jasmine.any(Array));
    expect(brs['model.property1'][0].message).toBe('message #1');
    expect(brs['model.property1'][0].severity).toBe(RuleSeverity.warning);
    expect(brs['model.property2']).toEqual(jasmine.any(Array));
    expect(brs['model.property2'][0].message).toBe('message #2');
    expect(brs['model.property2'][0].severity).toBe(RuleSeverity.error);

    brl.clearAll();
    brs = brl.output();

    expect(brs.$length).toBe(0);
  });

  it('clear and clearAll methods work for a property', function() {
    var brl = new BrokenRuleList('model');
    var br1 = new BrokenRule('name #1', false, 'property', 'message #1', RuleSeverity.error);
    var br2 = new BrokenRule('name #2', true, 'property', 'message #2', RuleSeverity.error);
    brl.add(br1);
    brl.add(br2);
    var pi = new PropertyInfo('property', new Text());

    brl.clear(pi);
    var brs = brl.output();

    expect(brs['model.property']).toEqual(jasmine.any(Array));
    expect(brs['model.property'][0].message).toBe('message #2');

    brl.clearAll(pi);
    brs = brl.output();

    expect(brs.$length).toBe(0);
  });

  it('clear and clearAll methods work for all properties', function() {
    var brl = new BrokenRuleList('model');
    var br1 = new BrokenRule('name #1', false, 'property1', 'message #1', RuleSeverity.error);
    var br2 = new BrokenRule('name #2', true, 'property2', 'message #2', RuleSeverity.error);
    brl.add(br1);
    brl.add(br2);

    brl.clear();
    var brs = brl.output();

    expect(brs['model.property1']).not.toBeDefined();
    expect(brs['model.property2']).toEqual(jasmine.any(Array));
    expect(brs['model.property2'][0].message).toBe('message #2');

    brl.clearAll();
    brs = brl.output();

    expect(brs.$length).toBe(0);
  });
});
