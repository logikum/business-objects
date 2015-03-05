console.log('Testing rules/broken-rules-output.js...');

var BrokenRulesOutput = require('../../source/rules/broken-rules-output.js');
var RuleNotice = require('../../source/rules/rule-notice.js');
var RuleSeverity = require('../../source/rules/rule-severity.js');

describe('Broken rules output', function () {

  it('constructor expects no argument', function () {
    var build01 = function () { return new BrokenRulesOutput(); };

    expect(build01).not.toThrow();
  });

  it('has read-only $length property', function() {
    var bro = new BrokenRulesOutput();
    var notice = new RuleNotice('message', RuleSeverity.error);

    expect(bro.$length).toBe(0);

    bro.add('property', notice);

    expect(bro.$length).toBe(1);

    bro.$length = 99;

    expect(bro.$length).toBe(1);
  });

  it('has read-only $count property', function() {
    var bro = new BrokenRulesOutput();
    var notice = new RuleNotice('message', RuleSeverity.error);

    expect(bro.$count).toBe(0);

    bro.add('property', notice);

    expect(bro.$count).toBe(1);

    bro.$count = 99;

    expect(bro.$count).toBe(1);
  });

  it('add method expects two non-empty string and a severity argument', function() {
    var bro = new BrokenRulesOutput();
    var notice = new RuleNotice('message', RuleSeverity.error);

    var add01 = function () { bro.add(); };
    var add02 = function () { bro.add('property'); };
    var add03 = function () { bro.add(notice); };
    var add04 = function () { bro.add(notice, 'property'); };
    var add05 = function () { bro.add('', notice); };
    var add06 = function () { bro.add('message', RuleSeverity.error); };
    var add07 = function () { bro.add('property', notice); };
    var add08 = function () { bro.add(null, null); };

    expect(add01).toThrow();
    expect(add02).toThrow();
    expect(add03).toThrow();
    expect(add04).toThrow();
    expect(add05).toThrow();
    expect(add06).toThrow();
    expect(add07).not.toThrow();
    expect(add08).toThrow();
  });

  it('add method creates an array property', function() {
    var bro = new BrokenRulesOutput();
    bro.add('property', new RuleNotice('message #1', RuleSeverity.information));
    bro.add('property', new RuleNotice('message #2', RuleSeverity.error));

    expect(bro.property).toEqual(jasmine.any(Array));
    expect(bro.property[0].message).toBe('message #1');
    expect(bro.property[0].severity).toBe(RuleSeverity.information);
    expect(bro.property[1].message).toBe('message #2');
    expect(bro.property[1].severity).toBe(RuleSeverity.error);
  });

  it('addChild method expects two arguments', function() {
    var bro = new BrokenRulesOutput();
    var broChild = new BrokenRulesOutput();

    var add01 = function () { bro.addChild(); };
    var add02 = function () { bro.addChild('property'); };
    var add03 = function () { bro.addChild('property', 'message'); };
    var add04 = function () { bro.addChild('property', broChild); };
    var add05 = function () { bro.addChild(broChild); };
    var add06 = function () { bro.addChild(broChild, 'property'); };
    var add07 = function () { bro.addChild('', broChild); };
    var add08 = function () { bro.addChild(1, broChild); };

    expect(add01).toThrow();
    expect(add02).toThrow();
    expect(add03).toThrow();
    expect(add04).not.toThrow();
    expect(add05).toThrow();
    expect(add06).toThrow();
    expect(add07).toThrow();
    expect(add08).toThrow();
  });

  it('addChildren method expects two arguments', function() {
    var bro = new BrokenRulesOutput();
    var broChild = new BrokenRulesOutput();
    var broChildren = [ broChild ];

    var add01 = function () { bro.addChildren(); };
    var add02 = function () { bro.addChildren('property'); };
    var add03 = function () { bro.addChildren('property', 'message'); };
    var add04 = function () { bro.addChildren('property', broChild); };
    var add05 = function () { bro.addChildren('property', broChildren); };
    var add06 = function () { bro.addChildren(broChildren, 'property'); };
    var add07 = function () { bro.addChildren(broChildren); };
    var add08 = function () { bro.addChildren(true, broChildren); };

    expect(add01).toThrow();
    expect(add02).toThrow();
    expect(add03).toThrow();
    expect(add04).not.toThrow();
    expect(add05).not.toThrow();
    expect(add06).toThrow();
    expect(add07).toThrow();
    expect(add08).toThrow();
  });
});
