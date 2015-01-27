'use strict';

var util = require('util');
var t = require('../locales/i18n-bo.js')('Rules');
var EnsureArgument = require('../shared/ensure-argument.js');
var ValidationRule = require('../rules/validation-rule.js');

/**
 * @classdesc The rule ensures that the value of the property reaches a given value.
 * @description Creates a new min-value rule object.
 *
 * @memberof bo.commonRules
 * @constructor
 * @param {bo.shared.PropertyInfo} primaryProperty - The property definition the rule relates to.
 * @param {number} minValue - The minimum value of the property.
 * @param {string} message - Human-readable description of the rule failure.
 * @param {number} [priority] - The priority of the rule.
 * @param {boolean} [stopsProcessing=false] - Indicates the rule behavior in case of failure.
 *
 * @extends bo.rules.ValidationRule
 *
 * @throws {@link bo.shared.ArgumentError Argument error}: The primary property must be a PropertyInfo object.
 * @throws {@link bo.shared.ArgumentError Argument error}: The minimum value is required.
 * @throws {@link bo.shared.ArgumentError Argument error}: The message must be a non-empty string.
 */
function MinValueRule(primaryProperty, minValue, message, priority, stopsProcessing) {
  ValidationRule.call(this, 'MinValue');

  /**
   * The minimum value of the property.
   * @type {number}
   * @readonly
   */
  this.minValue = EnsureArgument.hasValue(minValue, 'c_required', 'MinValueRule', 'minValue');

  // Initialize base properties.
  this.initialize(
      primaryProperty,
      message || t('minValue', primaryProperty.name, minValue),
      priority,
      stopsProcessing
  );

  // Immutable object.
  Object.freeze(this);
}
util.inherits(MinValueRule, ValidationRule);

/**
 * Checks if the value of the property reaches the defined value.
 *
 * @abstract
 * @function bo.commonRules.MinValueRule#execute
 * @param {Array.<*>} inputs - An array of the values of the required properties.
 * @returns {(bo.rules.ValidationResult|undefined)} Information about the failure.
 */
MinValueRule.prototype.execute = function (inputs) {

  var value = inputs[this.primaryProperty.name];

  if (!value || value < this.minValue)
    return this.result(this.message);
};

module.exports = MinValueRule;
