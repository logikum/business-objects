'use strict';

var util = require('util');
var t = require('../locales/i18n-bo.js')('Rules');
var EnsureArgument = require('../system/ensure-argument.js');
var AuthorizationRule = require('../rules/authorization-rule.js');
var UserInfo = require('../system/user-info.js');

/**
 * @classdesc The rule ensures that the user is member of a role from a group.
 * @description Creates a new is-in-any-role rule object.
 *
 * @memberof bo.commonRules
 * @constructor
 * @param {bo.rules.AuthorizationAction} action - The action to be authorized.
 * @param {(bo.shared.PropertyInfo|string|null)} [target] - Eventual parameter of the authorization action.
 * @param {Array.<string>} roles - The names of the roles the user can be member of.
 * @param {string} message - Human-readable description of the rule failure.
 * @param {number} [priority=100] - The priority of the rule.
 * @param {boolean} [stopsProcessing=false] - Indicates the rule behavior in case of failure.
 *
 * @extends bo.rules.AuthorizationRule
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The action must be a AuthorizationAction item.
 * @throws {@link bo.system.ArgumentError Argument error}: The target must be a PropertyInfo object in case of property read or write.
 * @throws {@link bo.system.ArgumentError Argument error}: The target must be a non-empty string in case of method execution.
 * @throws {@link bo.system.ArgumentError Argument error}: The target must be null in case of model actions.
 * @throws {@link bo.system.ArgumentError Argument error}: The roles must be an array of string values.
 * @throws {@link bo.system.ArgumentError Argument error}: The message must be a non-empty string.
 */
function IsInAnyRoleRule(action, target, roles, message, priority, stopsProcessing) {
  AuthorizationRule.call(this, 'IsInAnyRole');

  /**
   * The names of the roles the user can be member of.
   * @type {Array.<string>}
   * @readonly
   */
  this.roles = EnsureArgument.isMandatoryArray(roles, String, 'c_manArrayPrim', 'IsInAnyRoleRule', 'roles');

  // Initialize base properties.
  this.initialize(
    action,
    target,
    message || t('isInAnyRole', roles.join(', ')),
    priority,
    stopsProcessing
  );

  // Immutable object.
  Object.freeze(this);
}
util.inherits(IsInAnyRoleRule, AuthorizationRule);

/**
 * Checks if the  user is member of a role from the defined group.
 *
 * @abstract
 * @function bo.commonRules.IsInAnyRoleRule#execute
 * @param {bo.system.UserInfo} userInfo - Information about the current user.
 * @returns {(bo.rules.AuthorizationResult|undefined)} Information about the failure.
 */
IsInAnyRoleRule.prototype.execute = function (userInfo) {
  userInfo = EnsureArgument.isOptionalType(userInfo, UserInfo,
    'm_optType', 'IsInAnyRoleRule', 'execute', 'userInfo', 'UserInfo');

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
