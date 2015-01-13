/**
 * Is-not-in-role rule module.
 * @module common-rules/is-not-in-role-rule
 */
'use strict';

var util = require('util');
var t = require('../locales/i18n-bo.js')('Rules');
var ensureArgument = require('../shared/ensure-argument.js');
var AuthorizationRule = require('../rules/authorization-rule.js');
var UserInfo = require('../shared/user-info.js');

function IsNotInRoleRule(action, target, role, message, priority, stopsProcessing) {
  IsNotInRoleRule.super_.call(this, 'IsNotInRole');

  this.role = ensureArgument.isMandatoryString(role, 'c_manString', 'IsNotInRoleRule', 'role');

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

IsNotInRoleRule.prototype.execute = function (userInfo) {

  userInfo = ensureArgument.isOptionalType(userInfo, UserInfo,
    'm_optType', 'IsNotInRoleRule', 'execute', 'userInfo', 'UserInfo');

  var hasPermission = !userInfo.isInRole(this.role);

  if (!hasPermission)
    return this.result(this.message);
};

module.exports = IsNotInRoleRule;
