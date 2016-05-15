console.log('Testing rules/rule-manager.js...');

function read ( filename ) {
  return require( '../../../source/' + filename );
}
var RuleManager = read( 'rules/rule-manager.js');
var ValidationRule = read( 'rules/validation-rule.js');
var ValidationContext = read( 'rules/validation-context.js');
var AuthorizationRule = read( 'rules/authorization-rule.js');
var AuthorizationContext = read( 'rules/authorization-context.js');
var AuthorizationAction = read( 'rules/authorization-action.js');
var NoAccessBehavior = read( 'rules/no-access-behavior.js');
var BrokenRuleList = read( 'rules/broken-rule-list.js');
var Text = read( 'data-types/text.js');
var DataStore = read( 'shared/data-store.js');
var PropertyInfo = read( 'shared/property-info.js');

describe('Rule manager', function () {
  var vr0 = new ValidationRule('ruleName');
  var ar0 = new AuthorizationRule('ruleName');

  var vr = new ValidationRule('ruleName');
  var property = new PropertyInfo('property', new Text());
  vr.initialize(property, 'message', 19, true);

  var ar = new AuthorizationRule('ruleName');
  ar.initialize(AuthorizationAction.updateObject, null, 'message', 13, true);

  it('constructor expects any rule argument', function () {
    var build01 = function () { return new RuleManager(); };
    var build02 = function () { return new RuleManager(1); };
    var build03 = function () { return new RuleManager(true); };
    var build04 = function () { return new RuleManager('rules'); };
    var build05 = function () { return new RuleManager(11.11); };
    var build06 = function () { return new RuleManager({}); };
    var build07 = function () { return new RuleManager([]); };
    var build08 = function () { return new RuleManager(vr0); };
    var build09 = function () { return new RuleManager(ar0); };
    var build10 = function () { return new RuleManager(vr); };
    var build11 = function () { return new RuleManager(ar); };
    var build12 = function () { return new RuleManager(vr, ar); };

    expect(build01).not.toThrow();
    expect(build02).toThrow();
    expect(build03).toThrow();
    expect(build04).toThrow();
    expect(build05).toThrow();
    expect(build06).toThrow();
    expect(build07).toThrow();
    expect(build08).toThrow();
    expect(build09).toThrow();
    expect(build10).not.toThrow();
    expect(build11).not.toThrow();
    expect(build12).not.toThrow();
  });

  it('initialize method works', function() {
    var rm = new RuleManager(vr, ar);
    rm.initialize(NoAccessBehavior.throwError);

    expect(rm.noAccessBehavior).toBe(NoAccessBehavior.throwError);
  });

  it('add method works', function() {
    var rm = new RuleManager();
    rm.initialize(NoAccessBehavior.throwError);

    var add01 = function () { rm.add(); };
    var add02 = function () { rm.add({}); };
    var add03 = function () { rm.add(vr0); };
    var add04 = function () { rm.add(ar0); };
    var add05 = function () { rm.add(vr); };
    var add06 = function () { rm.add(ar); };
    var add07 = function () { rm.add([vr, ar]); };

    expect(add01).toThrow();
    expect(add02).toThrow();
    expect(add03).toThrow();
    expect(add04).toThrow();
    expect(add05).not.toThrow();
    expect(add06).not.toThrow();
    expect(add07).toThrow();
  });

  it('validate method works', function() {
    var rm = new RuleManager(vr);
    rm.initialize(NoAccessBehavior.throwError);

    var brokenRules = new BrokenRuleList('modelName');
    var context = new ValidationContext(new DataStore(), brokenRules);

    var validate01 = function () { rm.validate(property, context); };

    expect(validate01).toThrow('The ValidationRule.execute method is not implemented.');
  });

  it('hasPermission method works', function() {
    var rm = new RuleManager(ar);
    rm.initialize(NoAccessBehavior.throwError);

    var brokenRules = new BrokenRuleList('modelName');
    var context = new AuthorizationContext(AuthorizationAction.updateObject, '', brokenRules);

    var hasPermission01 = function () {
      rm.hasPermission(context);
    };

    expect(hasPermission01).toThrow('The AuthorizationRule.execute method is not implemented.');
  });
});
