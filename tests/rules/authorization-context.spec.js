console.log('Testing rules/authorization-context.js...');

var AuthorizationContext = require('../../source/rules/authorization-context.js');
var AuthorizationAction = require('../../source/rules/authorization-action.js');
var BrokenRuleList = require('../../source/rules/broken-rule-list.js');
var UserInfo = require('../../source/shared/user-info.js');

describe('Authorization context', function () {
  var user = new UserInfo('user-code');
  var brokenRules = new BrokenRuleList('modelName');

  it('constructor expects four arguments', function () {
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
      return new AuthorizationContext(AuthorizationAction.writeProperty, 'property', user);
    };
    var build05 = function () {
      return new AuthorizationContext(AuthorizationAction.writeProperty, 'property', user, brokenRules);
    };
    var build06 = function () {
      return new AuthorizationContext(AuthorizationAction.writeProperty, '', user, brokenRules);
    };

    expect(build01).toThrow();
    expect(build02).toThrow();
    expect(build03).toThrow();
    expect(build04).toThrow();
    expect(build05).not.toThrow();
    expect(build06).not.toThrow();
  });

  it('has two properties', function() {
    var ctx = new AuthorizationContext(AuthorizationAction.writeProperty, 'property', user, brokenRules);

    expect(ctx.user).toBe(user);
    expect(ctx.brokenRules).toBe(brokenRules);
  });

  it('has read-only properties', function() {
    var ctx = new AuthorizationContext(AuthorizationAction.writeProperty, 'property', user, brokenRules);
    ctx.user = null;
    ctx.brokenRules = null;

    expect(ctx.user).not.toBeNull();
    expect(ctx.brokenRules).not.toBeNull();
  });

  it('getRuleId method returns the expected identity', function() {
    var ctx1 = new AuthorizationContext(AuthorizationAction.writeProperty, 'property', user, brokenRules);
    var ctx2 = new AuthorizationContext(AuthorizationAction.fetchObject, '', user, brokenRules);

    expect(ctx1.getRuleId()).toBe('1.property');
    expect(ctx2.getRuleId()).toBe('2');
  });
});
