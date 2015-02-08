'use strict';

var util = require('util');
var EnsureArgument = require('../system/ensure-argument.js');
var ArgumentError = require('../system/argument-error.js');
var PropertyInfo = require('../shared/property-info.js');
var RuleBase = require('./rule-base.js');
var RuleSeverity = require('./rule-severity.js');
var AuthorizationAction = require('./authorization-action.js');
var AuthorizationResult = require('./authorization-result.js');
var AuthorizationError = require('./authorization-error.js');
var NoAccessBehavior = require('./no-access-behavior.js');

/**
 * @classdesc
 *      Represents an authorization rule.
 * @description
 *      Creates a new authorization rule object.
 *      The rule instances should be frozen.
 *
 * @memberof bo.rules
 * @constructor
 * @param {string} ruleName - The name of the rule.
 *    It is typically the name of the constructor, without the Rule suffix.
 *
 * @extends bo.rules.RuleBase
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The rule name must be a non-empty string.
 */
function AuthorizationRule(ruleName) {
  RuleBase.call(this, ruleName);

  var self = this;
  var noAccessBehavior = NoAccessBehavior.throwError;
  var propertyName = '';

  /**
   * The identifier of the authorization action. Generally it is the action value,
   * or when target is not empty, the action value and the target name separated by
   * a dot, respectively.
   * @type {string}
   * @readonly
   */
  this.ruleId = null;

  /**
   * The action to do when the rule fails.
   * @name bo.rules.AuthorizationRule#noAccessBehavior
   * @type {bo.rules.NoAccessBehavior}
   */
  Object.defineProperty(this, 'noAccessBehavior', {
    get: function () {
      return noAccessBehavior;
    },
    set: function (value) {
      noAccessBehavior = EnsureArgument.isEnumMember(value, NoAccessBehavior, null,
          'p_enumMember', 'AuthorizationRule', 'noAccessBehavior');
    },
    enumeration: true
  });

  /**
   * Sets the properties of the rule.
   *
   * @param {bo.rules.AuthorizationAction} action - The action to be authorized.
   * @param {(bo.shared.PropertyInfo|string|null)} [target] - Eventual parameter of the authorization action.
   * @param {string} message - Human-readable description of the rule failure.
   * @param {number} [priority=10] - The priority of the rule.
   * @param {boolean} [stopsProcessing=false] - Indicates the rule behavior in case of failure.
   *
   * @throws {@link bo.system.ArgumentError Argument error}: The action must be a AuthorizationAction item.
   * @throws {@link bo.system.ArgumentError Argument error}: The target must be a PropertyInfo object in case of property read or write.
   * @throws {@link bo.system.ArgumentError Argument error}: The target must be a non-empty string in case of method execution.
   * @throws {@link bo.system.ArgumentError Argument error}: The target must be null in case of model actions.
   * @throws {@link bo.system.ArgumentError Argument error}: The message must be a non-empty string.
   */
  this.initialize = function (action, target, message, priority, stopsProcessing) {

    action = EnsureArgument.isEnumMember(action, AuthorizationAction, null,
        'm_enumMember', 'AuthorizationRule', 'initialize', 'action');
    this.ruleId = AuthorizationAction.getName(action);

    if (action === AuthorizationAction.readProperty || action === AuthorizationAction.writeProperty) {
      target = EnsureArgument.isMandatoryType(target, PropertyInfo,
          'm_manType', 'AuthorizationRule', 'initialize', 'target');
      propertyName = target.name;
      this.ruleId += '.' + target.name;

    } else if (action === AuthorizationAction.executeMethod) {
      target = EnsureArgument.isMandatoryString(target,
          'm_manString', 'AuthorizationRule', 'initialize', 'target');
      this.ruleId += '.' + target;

    } else {
      if (target !== null)
        throw new ArgumentError('m_null', 'AuthorizationRule', 'initialize', 'target');
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

  /**
   * Returns the result of the rule executed.
   * If the rule fails and the noAccessBehavior property is
   * {@link bo.rules.NoAccessBehavior#throwError}, throws an authorization error.
   *
   * @param {string} [message] - Human-readable description of the rule failure.
   * @param {bo.rules.RuleSeverity} severity - The severity of the failed rule.
   * @returns {bo.rules.AuthorizationResult} The result of the authorization rule.
   *
   * @throws {@link bo.shared.AuthorizationError Authorization error}: The user has no permission to execute the action.
   */
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

  // Immutable object.
  Object.freeze(AuthorizationRule);
}
util.inherits(AuthorizationRule, RuleBase);

module.exports = AuthorizationRule;
