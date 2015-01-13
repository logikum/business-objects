/**
 * Is-in-role rule module.
 * @module common-rules/is-in-role-rule
 */
'use strict';

var util = require('util');
var t = require('../locales/i18n-bo.js')('Rules');
var ensureArgument = require('../shared/ensure-argument.js');
var AuthorizationRule = require('../rules/authorization-rule.js');
var UserInfo = require('../shared/user-info.js');

function IsInRoleRule(action, target, role, message, priority, stopsProcessing) {
  IsInRoleRule.super_.call(this, 'IsInRole');

  this.role = ensureArgument.isMandatoryString(role, 'c_manString', 'IsInRoleRule', 'role');

  // Initialize base properties.
  this.initialize(
      action,
      target,
      message || t('isInRole', role),
      priority,
      stopsProcessing
  );

  // Immutable object.
  Object.freeze(this);
}
util.inherits(IsInRoleRule, AuthorizationRule);

IsInRoleRule.prototype.execute = function (userInfo) {

  userInfo = ensureArgument.isOptionalType(userInfo, UserInfo,
    'm_optType', 'IsInRoleRule', 'execute', 'userInfo', 'UserInfo');

  var hasPermission = userInfo.isInRole(this.role);

  if (!hasPermission)
    return this.result(this.message);
};

module.exports = IsInRoleRule;
