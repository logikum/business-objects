console.log('Testing rules/rule-list.js...');

function read ( filename ) {
  return require( '../../../source/' + filename );
}
var RuleList = read( 'rules/rule-list.js');
var InformationRule = read( 'common-rules/information-rule.js');
var RequiredRule = read( 'common-rules/required-rule.js');
var PropertyInfo = read( 'shared/property-info.js');
var Text = read( 'data-types/text.js');

describe('Rule list', function () {

  it('constructor expects no argument', function () {
    var build01 = function () { return new RuleList(); };

    expect(build01).not.toThrow();
  });

  it('add method expects a non-empty string and a rule argument', function() {
    var rl = new RuleList();
    var pi = new PropertyInfo('property', new Text());
    var rule = new RequiredRule(pi, 'message', 13, true);

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
    var pi = new PropertyInfo('property', new Text());
    var rule1 = new InformationRule(pi, 'message #1', 7, false);
    var rule2 = new RequiredRule(pi, 'message #2', 13, true);
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
    var pi = new PropertyInfo('property', new Text());
    var rule1 = new InformationRule(pi, 'message #1', 7, false);
    var rule2 = new RequiredRule(pi, 'message #2', 13, true);
    rl.add('property', rule1);
    rl.add('property', rule2);
    rl.sort();

    expect(rl.property[0].message).toBe('message #2');
    expect(rl.property[1].message).toBe('message #1');
  });
});
