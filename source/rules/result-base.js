'use strict';

var BrokenRule = require('./broken-rule.js');
var RuleSeverity = require('./rule-severity.js');

/**
 * @classdesc Serves as the base class for rule results of failed rules.
 * @description Creates a new rule result object.
 *
 * @memberof bo.rules
 * @constructor
 */
var ResultBase = function () {

  /**
   * The name of the rule.
   * @type {string}
   * @readonly
   */
  this.ruleName = null;
  /**
   * The name of the property the rule belongs to.
   * @type {string}
   * @readonly
   */
  this.propertyName = null;
  /**
   * Human-readable description of the reason of the failure.
   * @type {string}
   * @readonly
   */
  this.message = null;
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
