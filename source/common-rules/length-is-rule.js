'use strict';

var util = require('util');
var t = require('../locales/i18n-bo.js')('Rules');
var EnsureArgument = require('../shared/ensure-argument.js');
var ValidationRule = require('../rules/validation-rule.js');

/**
 * @classdesc The rule ensures that the length of the property value has a given length.
 * @description Creates a new length-is rule object.
 *
 * @memberof bo.commonRules
 * @constructor
 * @param {bo.shared.PropertyInfo} primaryProperty - The property definition the rule relates to.
 * @param {number} length - The required length of the property value.
 * @param {string} message - Human-readable description of the rule failure.
 * @param {number} [priority] - The priority of the rule.
 * @param {boolean} [stopsProcessing=false] - Indicates the rule behavior in case of failure.
 *
 * @extends bo.rules.ValidationRule
 *
 * @throws {@link bo.shared.ArgumentError Argument error}: The primary property must be a PropertyInfo object.
 * @throws {@link bo.shared.ArgumentError Argument error}: The length must be an integer value.
 * @throws {@link bo.shared.ArgumentError Argument error}: The message must be a non-empty string.
 */
function LengthIsRule(primaryProperty, length, message, priority, stopsProcessing) {
  ValidationRule.call(this, 'LengthIs');

  /**
   * The required length of the property value.
   * @type {number}
   * @readonly
   */
  this.length = EnsureArgument.isMandatoryInteger(length, 'c_manInteger', 'LengthIsRule', 'length');

  // Initialize base properties.
  this.initialize(
      primaryProperty,
      message || (length > 1 ?
        t('lengthIs', primaryProperty.name, length) :
        t('lengthIs1', primaryProperty.name)),
      priority,
      stopsProcessing
  );

  // Immutable object.
  Object.freeze(this);
}
util.inherits(LengthIsRule, ValidationRule);

/**
 * Checks if the length of the property value equals to the defined length.
 *
 * @abstract
 * @function bo.commonRules.LengthIsRule#execute
 * @param {Array.<*>} inputs - An array of the values of the required properties.
 * @returns {(bo.rules.ValidationResult|undefined)} Information about the failure.
 */
LengthIsRule.prototype.execute = function (inputs) {

  var value = inputs[this.primaryProperty.name];

  if (!value || value.toString().length !== this.length)
    return this.result(this.message);
};

module.exports = LengthIsRule;
