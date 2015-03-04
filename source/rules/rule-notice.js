'use strict';

var CLASS_NAME = 'RuleNotice';

var EnsureArgument = require('../system/ensure-argument.js');
var RuleSeverity = require('./rule-severity.js');

/**
 * @classdesc Represents the public information of a failed rule.
 * @description Creates a new rule notice instance.
 *
 * @memberof bo.rules
 * @constructor
 * @param {string} message - Human-readable description of the reason of the failure.
 * @param {bo.rules.RuleSeverity} severity - The severity of the rule failure.
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The message must be a non-empty string.
 * @throws {@link bo.system.ArgumentError Argument error}: The severity must be a RuleSeverity item.
 */
function RuleNotice (message, severity) {

  /**
   * Human-readable description of the reason of the failure.
   * @type {string}
   */
  this.message = EnsureArgument.isMandatoryString(message,
      'c_manString', CLASS_NAME, 'message');

  /**
   * The severity of the rule failure.
   * @type {bo.rules.RuleSeverity}
   */
  this.severity = EnsureArgument.isEnumMember(severity, RuleSeverity, RuleSeverity.error,
      'c_enumMember', CLASS_NAME, 'severity');

  // Immutable object.
  Object.freeze(this);
}

module.exports = RuleNotice;
