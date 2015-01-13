/**
 * Is-not-in-any-role rule module.
 * @module common-rules/is-not-in-any-role-rule
 */
'use strict';

var util = require('util');
var t = require('../locales/i18n-bo.js')('Rules');
var ensureArgument = require('../shared/ensure-argument.js');
var AuthorizationRule = require('../rules/authorization-rule.js');
var UserInfo = require('../shared/user-info.js');

function IsNotInAnyRoleRule(action, target, roles, message, priority, stopsProcessing) {
  IsNotInAnyRoleRule.super_.call(this, 'IsNotInAnyRole');

  this.roles = ensureArgument.isMandatoryArray(roles, String, 'c_manArrayPrim', 'IsNotInAnyRoleRule', 'roles');

  // Initialize base properties.
  this.initialize(
    action,
    target,
    message || t('isNotInAnyRole', roles),
    priority,
    stopsProcessing
  );

  // Immutable object.
  Object.freeze(this);
}
util.inherits(IsNotInAnyRoleRule, AuthorizationRule);

IsNotInAnyRoleRule.prototype.execute = function (userInfo) {

  userInfo = ensureArgument.isOptionalType(userInfo, UserInfo,
    'm_optType', 'IsNotInAnyRoleRule', 'execute', 'userInfo', 'UserInfo');

  var hasPermission = true;

  if (userInfo) {
    if (this.roles.length > 0) {
      for (var i = 0; i < this.roles.length; i++) {
        var role = this.roles[i];
        if (userInfo.isInRole(role)) {
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

module.exports = IsNotInAnyRoleRule;
