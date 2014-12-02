console.log('Testing rules/validation-context.js...');

var ValidationContext = require('../../source/rules/validation-context.js');
var BrokenRuleList = require('../../source/rules/broken-rule-list.js');

describe('Validation context', function () {
  function getProperty () { }
  var brokenRules = new BrokenRuleList('modelName');

  it('constructor expects two arguments', function () {
    var build01 = function () { return new ValidationContext(); };
    var build02 = function () { return new ValidationContext('getProperty'); };
    var build03 = function () { return new ValidationContext('getProperty', {}); };
    var build04 = function () { return new ValidationContext('getProperty', brokenRules); };
    var build05 = function () { return new ValidationContext(getProperty, 'brokenRules'); };
    var build06 = function () { return new ValidationContext(getProperty, brokenRules); };
    var build07 = function () { return new ValidationContext(getProperty); };
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
    var ctx = new ValidationContext(getProperty, brokenRules);

    expect(ctx.getProperty).toBe(getProperty);
    expect(ctx.brokenRules).toBe(brokenRules);
  });

  it('has read-only properties', function() {
    var ctx = new ValidationContext(getProperty, brokenRules);
    ctx.getProperty = null;
    ctx.brokenRules = null;

    expect(ctx.getProperty).not.toBeNull();
    expect(ctx.brokenRules).not.toBeNull();
  });
});
