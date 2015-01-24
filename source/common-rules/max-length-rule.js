'use strict';

var util = require('util');
var t = require('../locales/i18n-bo.js')('Rules');
var ensureArgument = require('../shared/ensure-argument.js');
var ValidationRule = require('../rules/validation-rule.js');

/**
 * @classdesc The rule ensures that the length of the property value does not exceed a given length.
 * @description Creates a new max-length rule object.
 *
 * @memberof bo.commonRules
 * @constructor
 * @param {bo.shared.PropertyInfo} primaryProperty - The property definition the rule relates to.
 * @param {number} maxLength - The maximum length of the property value.
 * @param {string} message - Human-readable description of the rule failure.
 * @param {number} [priority] - The priority of the rule.
 * @param {boolean} [stopsProcessing=false] - Indicates the rule behavior in case of failure.
 *
 * @extends bo.rules.ValidationRule
 *
 * @throws {@link bo.shared.ArgumentError Argument error}: The primary property must be a PropertyInfo object.
 * @throws {@link bo.shared.ArgumentError Argument error}: The maximum length must be an integer value.
 * @throws {@link bo.shared.ArgumentError Argument error}: The message must be a non-empty string.
 */
function MaxLengthRule(primaryProperty, maxLength, message, priority, stopsProcessing) {
  MaxLengthRule.super_.call(this, 'MaxLength');

  /**
   * The maximum length of the property value.
   * @type {number}
   * @readonly
   */
  this.maxLength = ensureArgument.isMandatoryInteger(maxLength, 'c_manInteger', 'MaxLengthRule', 'maxLength');

  // Initialize base properties.
  this.initialize(
      primaryProperty,
      message || (maxLength > 1 ?
        t('maxLength', primaryProperty.name, maxLength) :
        t('maxLength1', primaryProperty.name)),
      priority,
      stopsProcessing
  );

  // Immutable object.
  Object.freeze(this);
}
util.inherits(MaxLengthRule, ValidationRule);

/**
 * Checks if the length of the property value does not exceed the defined length.
 *
 * @abstract
 * @function bo.commonRules.MaxLengthRule#execute
 * @param {Array.<*>} inputs - An array of the values of the required properties.
 * @returns {(bo.rules.ValidationResult|undefined)} Information about the failure.
 */
MaxLengthRule.prototype.execute = function (inputs) {

  var value = inputs[this.primaryProperty.name];

  if (value && value.toString().length > this.maxLength)
    return this.result(this.message);
};

module.exports = MaxLengthRule;
