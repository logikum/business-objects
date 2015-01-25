'use strict';

var util = require('util');
var t = require('../locales/i18n-bo.js')('Rules');
var EnsureArgument = require('../shared/ensure-argument.js');
var ValidationRule = require('../rules/validation-rule.js');

/**
 * @classdesc The rule ensures that the length of the property value reaches a given length.
 * @description Creates a new min-length rule object.
 *
 * @memberof bo.commonRules
 * @constructor
 * @param {bo.shared.PropertyInfo} primaryProperty - The property definition the rule relates to.
 * @param {number} minLength - The minimum length of the property value.
 * @param {string} message - Human-readable description of the rule failure.
 * @param {number} [priority] - The priority of the rule.
 * @param {boolean} [stopsProcessing=false] - Indicates the rule behavior in case of failure.
 *
 * @extends bo.rules.ValidationRule
 *
 * @throws {@link bo.shared.ArgumentError Argument error}: The primary property must be a PropertyInfo object.
 * @throws {@link bo.shared.ArgumentError Argument error}: The minimum length must be an integer value.
 * @throws {@link bo.shared.ArgumentError Argument error}: The message must be a non-empty string.
 */
function MinLengthRule(primaryProperty, minLength, message, priority, stopsProcessing) {
  MinLengthRule.super_.call(this, 'MinLength');

  /**
   * The minimum length of the property value.
   * @type {number}
   * @readonly
   */
  this.minLength = EnsureArgument.isMandatoryInteger(minLength, 'c_manInteger', 'MinLengthRule', 'minLength');

  // Initialize base properties.
  this.initialize(
      primaryProperty,
      message || (minLength > 1 ?
        t('minLength', primaryProperty.name, minLength) :
        t('minLength1', primaryProperty.name)),
      priority,
      stopsProcessing
  );

  // Immutable object.
  Object.freeze(this);
}
util.inherits(MinLengthRule, ValidationRule);

/**
 * Checks if the length of the property value reaches the defined length.
 *
 * @abstract
 * @function bo.commonRules.MinLengthRule#execute
 * @param {Array.<*>} inputs - An array of the values of the required properties.
 * @returns {(bo.rules.ValidationResult|undefined)} Information about the failure.
 */
MinLengthRule.prototype.execute = function (inputs) {

  var value = inputs[this.primaryProperty.name];

  if (!value || value.toString().length < this.minLength)
    return this.result(this.message);
};

module.exports = MinLengthRule;
