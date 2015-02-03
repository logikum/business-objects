console.log('Testing rules/authorization-context.js...');

var AuthorizationContext = require('../../source/rules/authorization-context.js');
var AuthorizationAction = require('../../source/rules/authorization-action.js');
var BrokenRuleList = require('../../source/rules/broken-rule-list.js');
var UserInfo = require('../../source/shared/user-info.js');

describe('Authorization context', function () {
  var user = new UserInfo('user-code');
  var brokenRules = new BrokenRuleList('modelName');

  it('constructor expects three arguments', function () {
    var build01 = function () {
      return new AuthorizationContext();
    };
    var build02 = function () {
      return new AuthorizationContext(AuthorizationAction.writeProperty);
    };
    var build03 = function () {
      return new AuthorizationContext(AuthorizationAction.writeProperty, 'property');
    };
    var build04 = function () {
      return new AuthorizationContext(AuthorizationAction.writeProperty, 'property', brokenRules);
    };
    var build05 = function () {
      return new AuthorizationContext(AuthorizationAction.writeProperty, '', brokenRules);
    };

    expect(build01).toThrow();
    expect(build02).toThrow();
    expect(build03).toThrow();
    expect(build04).not.toThrow();
    expect(build05).not.toThrow();
  });

  it('has four properties', function() {
    var ctx = new AuthorizationContext(AuthorizationAction.writeProperty, 'property', brokenRules);

    expect(ctx.brokenRules).toBe(brokenRules);
    expect(ctx.ruleId).toBe('writeProperty.property');
    expect(ctx.user).toEqual(jasmine.any(UserInfo));
    expect(ctx.locale).toBe('hu-HU');
  });

  it('has read-only properties', function() {
    var ctx = new AuthorizationContext(AuthorizationAction.writeProperty, 'property', brokenRules);
    ctx.brokenRules = null;
    ctx.ruleId = null;
    ctx.user = null;
    ctx.locale = null;

    expect(ctx.brokenRules).not.toBeNull();
    expect(ctx.ruleId).not.toBeNull();
    expect(ctx.user).not.toBeNull();
    expect(ctx.locale).not.toBeNull();
  });
});
