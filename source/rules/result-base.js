'use strict';

var EnsureArgument = require('../shared/ensure-argument.js');
var BrokenRule = require('./broken-rule.js');
var RuleSeverity = require('./rule-severity.js');

/**
 * @classdesc Serves as the base class for the failed result of executing a rule.
 * @description Creates a new rule result object.
 *
 * @memberof bo.rules
 * @constructor
 * @param {string} ruleName - The name of the rule.
 * @param {string} propertyName - The name of the property the rule belongs to.
 * @param {string} message - Human-readable description of the reason of the failure.
 *
 * @throws {@link bo.shared.ArgumentError Argument error}: The rule name must be a non-empty string.
 * @throws {@link bo.shared.ArgumentError Argument error}: The message must be a non-empty string.
 */
var ResultBase = function (ruleName, propertyName, message) {

  /**
   * The name of the rule.
   * @type {string}
   * @readonly
   */
  this.ruleName = EnsureArgument.isMandatoryString(ruleName,
      'c_manString', 'RuleResult', 'ruleName');
  /**
   * The name of the property the rule belongs to.
   * @type {string}
   * @readonly
   */
  this.propertyName = propertyName || '';
  /**
   * Human-readable description of the reason of the failure.
   * @type {string}
   * @readonly
   */
  this.message = EnsureArgument.isMandatoryString(message,
      'c_manString', 'RuleResult', 'message');
  /**
   * The severity of the rule failure.
   * @type {bo.rules.RuleSeverity}
   * @readonly
   */
  this.severity = RuleSeverity.error;
  /**
   * Indicates whether processing the rules of the property should stop.
   * @type {boolean}
   * @readonly
   */
  this.stopsProcessing = false;
  /**
   * Indicates whether the broken rule of this failure is preserved when a new verification starts.
   * Typically the broken rules of authorization rules are retained.
   * @type {boolean}
   * @readonly
   */
  this.isPreserved = false;
};

/**
 * Maps the rule result to broken rule.
 *
 * @function bo.rules.ResultBase#toBrokenRule
 * @returns {bo.rules.BrokenRule} The broken rule companion of the rule result.
 */
ResultBase.prototype.toBrokenRule = function() {
  return new BrokenRule(
      this.ruleName,
      this.isPreserved,
      this.propertyName,
      this.message,
      this.severity
  );
};

module.exports = ResultBase;
