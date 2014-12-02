'use strict';

var ensureArgument = require('../shared/ensure-argument.js');
var UserInfo = require('../shared/user-info.js');
var BrokenRuleList = require('./broken-rule-list.js');
var AuthorizationAction = require('./authorization-action.js');

function AuthorizationContext(action, targetName, user, brokenRules) {

  action = ensureArgument.isEnumMember(action, AuthorizationAction, null,
    'The action argument of AuthorizationContext constructor must be an AuthorizationAction value.');
  targetName = ensureArgument.isString(targetName,
    'The targetName argument of AuthorizationContext constructor must be a string.');

  this.user = ensureArgument.isOptionalType(user, UserInfo,
    'The user argument of AuthorizationContext constructor must be an UserInfo object or null.');
  this.brokenRules = ensureArgument.isMandatoryType(brokenRules, BrokenRuleList,
    'The brokenRules argument of AuthorizationContext constructor must be a BrokenRuleList object.');

  this.getRuleId = function () {
    if (targetName)
      return action.toString() + '.' + targetName;
    else
      return action.toString();
  };

  // Immutable object.
  Object.freeze(this);
}

module.exports = AuthorizationContext;
