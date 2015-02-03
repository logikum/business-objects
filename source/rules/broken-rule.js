'use strict';

var EnsureArgument = require('../shared/ensure-argument.js');
var RuleSeverity = require('./rule-severity.js');

/**
 * @classdesc Represents the public turnout of a failed rule.
 * @description Creates a new broken rule instance.
 *
 * @memberof bo.rules
 * @constructor
 * @param {string} ruleName - The name of the failed rule.
 * @param {boolean} isPreserved - Indicates whether the broken rule of this failure
 *      is preserved when a new verification starts.
 * @param {string} [propertyName] - The name of the property the rule belongs to.
 * @param {string} message - Human-readable description of the reason of the failure.
 * @param {bo.rules.RuleSeverity} severity - The severity of the rule failure.
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The rule name must be a non-empty string.
 * @throws {@link bo.system.ArgumentError Argument error}: The preservation flag must be a Boolean value.
 * @throws {@link bo.system.ArgumentError Argument error}: The property name must be a string.
 * @throws {@link bo.system.ArgumentError Argument error}: The message must be a non-empty string.
 * @throws {@link bo.system.ArgumentError Argument error}: The severity must be a RuleSeverity item.
 */
function BrokenRule(ruleName, isPreserved, propertyName, message, severity) {

  /**
   * The name of the failed rule.
   * @type {string}
   */
  this.ruleName = EnsureArgument.isMandatoryString(ruleName,
      'c_manString', 'BrokenRule', 'ruleName');
  /**
   * Indicates whether the broken rule is preserved when a new verification starts.
   * @type {boolean}
   */
  this.isPreserved = EnsureArgument.isMandatoryBoolean(isPreserved || false,
      'c_manBoolean', 'BrokenRule' , 'isPreserved');
  /**
   * The name of the property the failed rule belongs to.
   * @type {string}
   */
  this.propertyName = EnsureArgument.isString(propertyName || '',
      'c_string', 'BrokenRule', 'propertyName');
  /**
   * Human-readable description of the reason of the failure.
   * @type {string}
   */
  this.message = EnsureArgument.isMandatoryString(message,
      'c_manString', 'BrokenRule', 'message');
  /**
   * The severity of the rule failure.
   * @type {bo.rules.RuleSeverity}
   */
  this.severity = EnsureArgument.isEnumMember(severity, RuleSeverity, RuleSeverity.error,
      'c_enumType', 'BrokenRule', 'severity');
}

module.exports = BrokenRule;
