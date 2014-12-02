'use strict';

var util = require('util');
var ensureArgument = require('../shared/ensure-argument.js');
var PropertyInfo = require('../shared/property-info.js');
var RuleBase = require('./rule-base.js');
var RuleSeverity = require('./rule-severity.js');
var AuthorizationAction = require('./authorization-action.js');
var AuthorizationResult = require('./authorization-result.js');
var NoAccessBehavior = require('./no-access-behavior.js');

function AuthorizationRule(ruleName) {
  AuthorizationRule.super_.call(this);

  var self = this;
  this.ruleName = ensureArgument.isMandatoryString(ruleName,
    'The ruleName argument of AuthorizationRule constructor must be a non-empty string.');
  var authAction = null;
  var authTarget = null;
  var noAccess = NoAccessBehavior.throwError;

  this.initialize = function (action, target, message, priority, stopsProcessing) {

    action = ensureArgument.isEnumMember(action, AuthorizationAction, null,
      'The action argument of AuthorizationRule.initialize method must be an AuthorizationAction value.');

    if (action === AuthorizationAction.readProperty || action === AuthorizationAction.writeProperty) {
      target = ensureArgument.isMandatoryType(target, PropertyInfo,
        'The target argument of AuthorizationRule.initialize method must be a PropertyInfo object.');
    } else if (action === AuthorizationAction.executeMethod) {
      target = ensureArgument.isMandatoryString(target,
        'The target argument of AuthorizationRule.initialize method must be a non-empty string.');
    } else {
      if (target !== null)
        throw new Error('The target argument of AuthorizationRule.initialize method must be null.');
    }

    authAction = action;
    authTarget = target;
    RuleBase.prototype.initialize.call(this, message, priority, stopsProcessing);
  };

  this.setNoAccessBehavior = function (behavior) {
    noAccess = ensureArgument.isEnumMember(behavior, NoAccessBehavior, null,
      'The behavior argument of AuthorizationRule.setNoAccessBehavior method must be a NoAccessBehavior value.');
  };

  function getTargetName() {
    if (authAction === AuthorizationAction.readProperty || authAction === AuthorizationAction.writeProperty) {
      return authTarget.name;
    } else if (authAction === AuthorizationAction.executeMethod) {
      return authTarget;
    } else {
      return '';
    }
  }

  this.getRuleId = function () {
    var action = authAction.toString();
    var target = getTargetName();
    if (target)
      return action + '.' + target;
    else
      return action;
  };

  function behaviorToSeverity(behavior) {
    switch (behavior) {
      case NoAccessBehavior.showInformation:
        return RuleSeverity.information;
      case NoAccessBehavior.showWarning:
        return RuleSeverity.warning;
      default:
        return RuleSeverity.error;
    }
  }

  this.result = function (message, severity) {
    if (noAccess === NoAccessBehavior.throwError) {
      throw new Error(message);
    } else {
      var result = new AuthorizationResult(this.ruleName, getTargetName(), message);
      result.severity = severity || behaviorToSeverity(noAccess);
      result.stopsProcessing = this.stopsProcessing;
      result.isPreserved = true;
      return result;
    }
  };

  Object.freeze(AuthorizationRule);
}
util.inherits(AuthorizationRule, RuleBase);

module.exports = AuthorizationRule;
