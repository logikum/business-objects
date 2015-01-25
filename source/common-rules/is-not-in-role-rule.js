'use strict';

var util = require('util');
var t = require('../locales/i18n-bo.js')('Rules');
var EnsureArgument = require('../shared/ensure-argument.js');
var AuthorizationRule = require('../rules/authorization-rule.js');
var UserInfo = require('../shared/user-info.js');

/**
 * @classdesc The rule ensures that the user is not member of a role.
 * @description Creates a new is-not-in-role rule object.
 *
 * @memberof bo.commonRules
 * @constructor
 * @param {bo.rules.AuthorizationAction} action - The action to be authorized.
 * @param {(bo.shared.PropertyInfo|string|null)} [target] - Eventual parameter of the authorization action.
 * @param {string} role - The name of the role the user is not member of.
 * @param {string} message - Human-readable description of the rule failure.
 * @param {number} [priority=100] - The priority of the rule.
 * @param {boolean} [stopsProcessing=false] - Indicates the rule behavior in case of failure.
 *
 * @extends bo.rules.AuthorizationRule
 *
 * @throws {@link bo.shared.ArgumentError Argument error}: The action must be a AuthorizationAction item.
 * @throws {@link bo.shared.ArgumentError Argument error}: The target must be a PropertyInfo object in case of property read or write.
 * @throws {@link bo.shared.ArgumentError Argument error}: The target must be a non-empty string in case of method execution.
 * @throws {@link bo.shared.ArgumentError Argument error}: The target must be null in case of model actions.
 * @throws {@link bo.shared.ArgumentError Argument error}: The role must be a non-empty string.
 * @throws {@link bo.shared.ArgumentError Argument error}: The message must be a non-empty string.
 */
function IsNotInRoleRule(action, target, role, message, priority, stopsProcessing) {
  IsNotInRoleRule.super_.call(this, 'IsNotInRole');

  /**
   * The name of the role the user is not member of.
   * @type {string}
   * @readonly
   */
  this.role = EnsureArgument.isMandatoryString(role, 'c_manString', 'IsNotInRoleRule', 'role');

  // Initialize base properties.
  this.initialize(
      action,
      target,
      message || t('isNotInRole', role),
      priority,
      stopsProcessing
  );

  // Immutable object.
  Object.freeze(this);
}
util.inherits(IsNotInRoleRule, AuthorizationRule);

/**
 * Checks if the  user is not member of the defined role.
 *
 * @abstract
 * @function bo.commonRules.IsNotInRoleRule#execute
 * @param {bo.shared.UserInfo} userInfo - Information about the current user.
 * @returns {(bo.rules.AuthorizationResult|undefined)} Information about the failure.
 */
IsNotInRoleRule.prototype.execute = function (userInfo) {

  userInfo = EnsureArgument.isOptionalType(userInfo, UserInfo,
    'm_optType', 'IsNotInRoleRule', 'execute', 'userInfo', 'UserInfo');

  var hasPermission = !userInfo.isInRole(this.role);

  if (!hasPermission)
    return this.result(this.message);
};

module.exports = IsNotInRoleRule;
