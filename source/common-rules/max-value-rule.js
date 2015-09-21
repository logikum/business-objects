'use strict';

var CLASS_NAME = 'MaxValueRule';

var util = require('util');
var t = require('../locales/i18n-bo.js')('Rules');
var EnsureArgument = require('../system/ensure-argument.js');
var ValidationRule = require('../rules/validation-rule.js');

/**
 * @classdesc
 *      The rule ensures that the value of the property does not exceed a given value.
 * @description
 *      Creates a new max-value rule object.
 *
 * @memberof bo.commonRules
 * @constructor
 * @param {bo.shared.PropertyInfo} primaryProperty - The property definition the rule relates to.
 * @param {number} maxValue - The maximum value of the property.
 * @param {string} message - Human-readable description of the rule failure.
 * @param {number} [priority=10] - The priority of the rule.
 * @param {boolean} [stopsProcessing=false] - Indicates the rule behavior in case of failure.
 *
 * @extends bo.rules.ValidationRule
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The primary property must be a PropertyInfo object.
 * @throws {@link bo.system.ArgumentError Argument error}: The maximum value is required.
 * @throws {@link bo.system.ArgumentError Argument error}: The message must be a non-empty string.
 */
function MaxValueRule (primaryProperty, maxValue, message, priority, stopsProcessing) {
  ValidationRule.call(this, 'MaxValue');

  /**
   * The maximum value of the property.
   * @type {number}
   * @readonly
   */
  this.maxValue = EnsureArgument.hasValue(maxValue, 'c_required', CLASS_NAME, 'maxValue');

  // Initialize base properties.
  this.initialize(
      primaryProperty,
      message || t('maxValue', primaryProperty.name, maxValue),
      priority,
      stopsProcessing
  );

  // Immutable object.
  Object.freeze(this);
}
util.inherits(MaxValueRule, ValidationRule);

/**
 * Checks if the value of the property does not exceed the defined value.
 *
 * @abstract
 * @function bo.commonRules.MaxValueRule#execute
 * @param {Array.<*>} inputs - An array of the values of the required properties.
 * @returns {(bo.rules.ValidationResult|undefined)} Information about the failure.
 */
MaxValueRule.prototype.execute = function (inputs) {

  var value = inputs[this.primaryProperty.name];

  if (value && value > this.maxValue)
    return this.result(this.message);
};

module.exports = MaxValueRule;
