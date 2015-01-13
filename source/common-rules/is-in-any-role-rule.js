/**
 * Is-in-any-role rule module.
 * @module common-rules/is-in-any-role-rule
 */
'use strict';

var util = require('util');
var t = require('../locales/i18n-bo.js')('Rules');
var ensureArgument = require('../shared/ensure-argument.js');
var AuthorizationRule = require('../rules/authorization-rule.js');
var UserInfo = require('../shared/user-info.js');

function IsInAnyRoleRule(action, target, roles, message, priority, stopsProcessing) {
  IsInAnyRoleRule.super_.call(this, 'IsInAnyRole');

  this.roles = ensureArgument.isMandatoryArray(roles, String, 'c_manArrayPrim', 'IsInAnyRoleRule', 'roles');

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

IsInAnyRoleRule.prototype.execute = function (userInfo) {
  userInfo = ensureArgument.isOptionalType(userInfo, UserInfo,
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
