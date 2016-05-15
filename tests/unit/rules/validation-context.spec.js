console.log('Testing rules/validation-context.js...');

function read ( filename ) {
  return require( '../../../source/' + filename );
}
var ValidationContext = read( 'rules/validation-context.js');
var BrokenRuleList = read( 'rules/broken-rule-list.js');
var DataStore = read( 'shared/data-store.js');

describe('Validation context', function () {
  function getValue () { }
  var brokenRules = new BrokenRuleList('modelName');

  it('constructor expects two arguments', function () {
    var build01 = function () { return new ValidationContext(); };
    var build02 = function () { return new ValidationContext({}); };
    var build03 = function () { return new ValidationContext([], {}); };
    var build04 = function () { return new ValidationContext(getValue, brokenRules); };
    var build05 = function () { return new ValidationContext(new DataStore(), 'brokenRules'); };
    var build06 = function () { return new ValidationContext(new DataStore(), brokenRules); };
    var build07 = function () { return new ValidationContext(new DataStore()); };
    var build08 = function () { return new ValidationContext(null, null); };

    expect(build01).toThrow();
    expect(build02).toThrow();
    expect(build03).toThrow();
    expect(build04).toThrow();
    expect(build05).toThrow();
    expect(build06).not.toThrow();
    expect(build07).toThrow();
    expect(build08).toThrow();
  });

  it('has two properties', function() {
    var ctx = new ValidationContext(new DataStore(), brokenRules);

    expect(ctx.getValue).toEqual(jasmine.any(Function));
    expect(ctx.brokenRules).toBe(brokenRules);
  });

  it('has read-only properties', function() {
    var ctx = new ValidationContext(new DataStore(), brokenRules);
    ctx.getValue = null;
    ctx.brokenRules = null;

    expect(ctx.getValue).not.toBeNull();
    expect(ctx.brokenRules).not.toBeNull();
  });
});
