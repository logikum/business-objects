'use strict';

var util = require('util');
var ensureArgument = require('../shared/ensure-argument.js');
var AuthorizationRule = require('../rules/authorization-rule.js');
var UserInfo = require('../shared/user-info.js');

function IsNotInRoleRule(action, target, role, message, priority, stopsProcessing) {
  IsNotInRoleRule.super_.call(this, 'IsNotInRole');

  var defaultMessage = 'The user is member of ' + role + ' role.';

  // Initialize base properties.
  this.initialize(
      action,
      target,
      message || defaultMessage,
      priority,
      stopsProcessing
  );

  this.role = ensureArgument.isMandatoryString(role,
    'The roles argument of IsNotInRoleRule constructor must be a non-empty string.');

  // Immutable object.
  Object.freeze(this);
}
util.inherits(IsNotInRoleRule, AuthorizationRule);

IsNotInRoleRule.prototype.execute = function (userInfo) {
  userInfo = ensureArgument.isOptionalType(userInfo, UserInfo,
    'The userInfo argument of IsNotInRoleRule.execute method must be a UserInfo object or null.');

  var hasPermission = !userInfo.isInRole(this.role);

  if (!hasPermission)
    return this.result(this.message);
};

module.exports = IsNotInRoleRule;
