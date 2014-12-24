'use strict';

var util = require('util');
var ensureArgument = require('../shared/ensure-argument.js');
var AuthorizationRule = require('../rules/authorization-rule.js');
var UserInfo = require('../shared/user-info.js');

function IsInAnyRoleRule(action, target, roles, message, priority, stopsProcessing) {
  IsInAnyRoleRule.super_.call(this, 'IsInAnyRole');

  var defaultMessage = 'The user is not member of any role of the following: ' + roles;

  // Initialize base properties.
  this.initialize(
    action,
    target,
    message || defaultMessage,
    priority,
    stopsProcessing
  );

  var msgRoles = 'The roles argument of IsInAnyRoleRule constructor must be an array of non-empty strings.';
  if (roles instanceof Array) {
    if (roles.some(function (role) {
        return typeof role !== 'string' || role.trim().length === 0;
      }))
      throw new Error(msgRoles);
  } else
    throw new Error(msgRoles);
  this.roles = roles;

  // Immutable object.
  Object.freeze(this);
}
util.inherits(IsInAnyRoleRule, AuthorizationRule);

IsInAnyRoleRule.prototype.execute = function (userInfo) {
  userInfo = ensureArgument.isOptionalType(userInfo, UserInfo,
    'The userInfo argument of IsInAnyRoleRule.execute method must be a UserInfo object or null.');

  var hasPermission = false;

  if (userInfo) {
    if (this.roles.length > 0) {
      for (var i = 0; i < this.roles.length; i++) {
        var role = this.roles[i];
        if (userInfo.isInRole(role)) {
          hasPermission = true;
          break;
        }
      }
    } else
      hasPermission = true;
  } else
    hasPermission = this.roles.length === 0;

  if (!hasPermission)
    return this.result(this.message);
};

module.exports = IsInAnyRoleRule;
