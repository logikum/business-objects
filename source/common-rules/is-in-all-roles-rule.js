'use strict';

var util = require('util');
var ensureArgument = require('../shared/ensure-argument.js');
var AuthorizationRule = require('../rules/authorization-rule.js');
var UserInfo = require('../shared/user-info.js');

function IsInAllRolesRule(action, target, roles, message, priority, stopsProcessing) {
  IsInAllRolesRule.super_.call(this, 'IsInAllRoles');

  var defaultMessage = 'The user is not member of all roles of the following: ' + roles;

  // Initialize base properties.
  this.initialize(
    action,
    target,
    message || defaultMessage,
    priority,
    stopsProcessing
  );

  var msgRoles = 'The roles argument of IsInAllRolesRule constructor must be a non-empty string or an array of non-empty strings.';
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
util.inherits(IsInAllRolesRule, AuthorizationRule);

IsInAllRolesRule.prototype.execute = function (userInfo) {
  userInfo = ensureArgument.isOptionalType(userInfo, UserInfo,
    'The userInfo argument of IsInAllRolesRule.execute method must be a UserInfo object or null.');

  var hasPermission = true;

  if (userInfo) {
    if (this.roles.length > 0) {
      for (var i = 0; i < this.roles.length; i++) {
        var role = this.roles[i];
        if (!userInfo.isInRole(role)) {
          hasPermission = false;
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

module.exports = IsInAllRolesRule;
