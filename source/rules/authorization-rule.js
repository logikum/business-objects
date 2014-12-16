'use strict';

var util = require('util');
var ensureArgument = require('../shared/ensure-argument.js');
var PropertyInfo = require('../shared/property-info.js');
var RuleBase = require('./rule-base.js');
var RuleSeverity = require('./rule-severity.js');
var AuthorizationAction = require('./authorization-action.js');
var AuthorizationResult = require('./authorization-result.js');
var AuthorizationError = require('./authorization-error.js');
var NoAccessBehavior = require('./no-access-behavior.js');

function AuthorizationRule(ruleName) {
  AuthorizationRule.super_.call(this);

  var self = this;
  var noAccessBehavior = NoAccessBehavior.throwError;
  var propertyName = '';

  this.ruleName = ensureArgument.isMandatoryString(ruleName,
    'The ruleName argument of AuthorizationRule constructor must be a non-empty string.');
  this.ruleId = null;

  Object.defineProperty(this, 'noAccessBehavior', {
    get: function () {
      return noAccessBehavior;
    },
    set: function (value) {
      noAccessBehavior = ensureArgument.isEnumMember(value, NoAccessBehavior, null,
        'The value of AuthorizationRule.noAccessBehavior property must be a NoAccessBehavior item.');
    },
    enumeration: true
  });

  this.initialize = function (action, target, message, priority, stopsProcessing) {

    action = ensureArgument.isEnumMember(action, AuthorizationAction, null,
      'The action argument of AuthorizationRule.initialize method must be an AuthorizationAction value.');
    this.ruleId = AuthorizationAction.getName(action);

    if (action === AuthorizationAction.readProperty || action === AuthorizationAction.writeProperty) {
      target = ensureArgument.isMandatoryType(target, PropertyInfo,
        'The target argument of AuthorizationRule.initialize method must be a PropertyInfo object.');
      propertyName = target.name;
      this.ruleId += '.' + target.name;

    } else if (action === AuthorizationAction.executeMethod) {
      target = ensureArgument.isMandatoryString(target,
        'The target argument of AuthorizationRule.initialize method must be a non-empty string.');
      this.ruleId += '.' + target;

    } else {
      if (target !== null)
        throw new Error('The target argument of AuthorizationRule.initialize method must be null.');
    }

    // Initialize base properties.
    RuleBase.prototype.initialize.call(this, message, priority, stopsProcessing);
  };

  function behaviorToSeverity() {
    switch (noAccessBehavior) {
      case NoAccessBehavior.showInformation:
        return RuleSeverity.information;
      case NoAccessBehavior.showWarning:
        return RuleSeverity.warning;
      default:
        return RuleSeverity.error;
    }
  }

  this.result = function (message, severity) {
    if (noAccessBehavior === NoAccessBehavior.throwError) {
      throw new AuthorizationError(message || this.message);
    } else {
      var result = new AuthorizationResult(this.ruleName, propertyName, message || this.message);
      result.severity = severity || behaviorToSeverity();
      result.stopsProcessing = this.stopsProcessing;
      result.isPreserved = true;
      return result;
    }
  };

  Object.freeze(AuthorizationRule);
}
util.inherits(AuthorizationRule, RuleBase);

module.exports = AuthorizationRule;
