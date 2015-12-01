'use strict';

var CLASS_NAME = 'BrokenRule';

var Argument = require('../system/argument-check.js');
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
function BrokenRule (ruleName, isPreserved, propertyName, message, severity) {
  var check = Argument.inConstructor(CLASS_NAME);

  /**
   * The name of the failed rule.
   * @type {string}
   */
  this.ruleName = check(ruleName).forMandatory('ruleName').asString();

  /**
   * Indicates whether the broken rule is preserved when a new verification starts.
   * @type {boolean}
   */
  this.isPreserved = check(isPreserved || false).forMandatory('isPreserved').asBoolean();

  /**
   * The name of the property the failed rule belongs to.
   * @type {string}
   */
  this.propertyName = check(propertyName || '').for('propertyName').asString();

  /**
   * Human-readable description of the reason of the failure.
   * @type {string}
   */
  this.message = check(message).forMandatory('message').asString();

  /**
   * The severity of the rule failure.
   * @type {bo.rules.RuleSeverity}
   */
  this.severity = check(severity).for('severity').asEnumMember(RuleSeverity, RuleSeverity.error);
}

module.exports = BrokenRule;
