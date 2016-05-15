console.log('Testing rules/rule-notice.js...');

function read ( filename ) {
  return require( '../../../source/' + filename );
}
var RuleNotice = read( 'rules/rule-notice.js');
var RuleSeverity = read( 'rules/rule-severity.js');

describe('Rule notice', function () {

  it('constructor expects five arguments', function () {
    var build01 = function () { return new RuleNotice(); };
    var build02 = function () { return new RuleNotice('message'); };
    var build03 = function () { return new RuleNotice('message', RuleSeverity.error); };
    var build04 = function () { return new RuleNotice(RuleSeverity.error, 'name'); };
    var build05 = function () { return new RuleNotice('', RuleSeverity.error); };

    expect(build01).toThrow();
    expect(build02).not.toThrow();
    expect(build03).not.toThrow();
    expect(build04).toThrow();
    expect(build05).toThrow();
  });

  it('has two read-only properties', function() {
    var br = new RuleNotice('message', RuleSeverity.success);

    expect(br.message).toBe('message');
    expect(br.severity).toBe(RuleSeverity.success);

    br.message = 'info';
    br.severity = RuleSeverity.warning;

    expect(br.message).toBe('message');
    expect(br.severity).toBe(RuleSeverity.success);
  });
});
