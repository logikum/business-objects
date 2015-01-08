'use strict';

var ensureArgument = require('../shared/ensure-argument.js');
var UserInfo = require('../shared/user-info.js');
var BrokenRuleList = require('./broken-rule-list.js');
var AuthorizationAction = require('./authorization-action.js');

function AuthorizationContext(action, targetName, user, brokenRules) {

  action = ensureArgument.isEnumMember(action, AuthorizationAction, null,
      'c_enumType', 'AuthorizationContext', 'action');
  targetName = ensureArgument.isString(targetName,
      'c_string', 'AuthorizationContext', 'targetName');
  this.user = ensureArgument.isOptionalType(user, UserInfo,
      'c_optType', 'AuthorizationContext', 'user');
  this.brokenRules = ensureArgument.isMandatoryType(brokenRules, BrokenRuleList,
      'c_manType', 'AuthorizationContext', 'brokenRules');

  this.ruleId = AuthorizationAction.getName(action);
  if (targetName)
    this.ruleId += '.' + targetName;

  // Immutable object.
  Object.freeze(this);
}

module.exports = AuthorizationContext;
