'use strict';

var util = require('util');
var t = require('../locales/i18n-bo.js')('Rules');
var ValidationRule = require('../rules/validation-rule.js');

/**
 * @classdesc
 *      The rule ensures that the property value exists.
 * @description
 *      Creates a new required rule object.
 *
 * @memberof bo.commonRules
 * @constructor
 * @param {bo.shared.PropertyInfo} primaryProperty - The property definition the rule relates to.
 * @param {string} message - Human-readable description of the rule failure.
 * @param {number} [priority=100] - The priority of the rule.
 * @param {boolean} [stopsProcessing=false] - Indicates the rule behavior in case of failure.
 *
 * @extends bo.rules.ValidationRule
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The primary property must be a PropertyInfo object.
 * @throws {@link bo.system.ArgumentError Argument error}: The message must be a non-empty string.
 */
function RequiredRule (primaryProperty, message, priority, stopsProcessing) {
  ValidationRule.call(this, 'Required');

  // Initialize base properties.
  this.initialize(
      primaryProperty,
      message || t('required', primaryProperty.name),
      priority || 100,
      stopsProcessing
  );

  // Immutable object.
  Object.freeze(this);
}
util.inherits(RequiredRule, ValidationRule);

/**
 * Checks if the value of the property exists.
 *
 * @abstract
 * @function bo.commonRules.RequiredRule#execute
 * @param {Array.<*>} inputs - An array of the values of the required properties.
 * @returns {(bo.rules.ValidationResult|undefined)} Information about the failure.
 */
RequiredRule.prototype.execute = function (inputs) {

  var value = inputs[this.primaryProperty.name];

  if (!this.primaryProperty.type.hasValue(value))
    return this.result(this.message);
};

module.exports = RequiredRule;
