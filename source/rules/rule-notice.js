'use strict';

var CLASS_NAME = 'RuleNotice';

var Argument = require('../system/argument-check.js');
var RuleSeverity = require('./rule-severity.js');

/**
 * @classdesc Represents the public information of a failed rule.
 * @description Creates a new rule notice instance.
 *
 * @memberof bo.rules
 * @constructor
 * @param {string} message - Human-readable description of the reason of the failure.
 * @param {bo.rules.RuleSeverity} [severity] - The severity of the rule failure, defaults to error.
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The message must be a non-empty string.
 * @throws {@link bo.system.ArgumentError Argument error}: The severity must be a RuleSeverity item.
 */
function RuleNotice (message, severity) {
  var check = Argument.inConstructor(CLASS_NAME);

  /**
   * Human-readable description of the reason of rule failure.
   * @type {string}
   * @readonly
   */
  this.message = check(message).forMandatory('message').asString();

  /**
   * The severity of the rule failure.
   * @type {bo.rules.RuleSeverity}
   * @readonly
   */
  this.severity = check(severity).for('severity').asEnumMember(RuleSeverity, RuleSeverity.error);

  // Immutable object.
  Object.freeze(this);
}

module.exports = RuleNotice;
