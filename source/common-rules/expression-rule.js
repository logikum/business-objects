'use strict';

var util = require('util');
var t = require('../locales/i18n-bo.js')('Rules');
var ensureArgument = require('../shared/ensure-argument.js');
var ValidationRule = require('../rules/validation-rule.js');
var NullResultOption = require('./null-result-option.js');

/**
 * @classdesc The rule ensures that the property value matches a regular expression.
 * @description Creates a new expression rule object.
 *
 * @memberof bo.commonRules
 * @constructor
 * @param {bo.shared.PropertyInfo} primaryProperty - The property definition the rule relates to.
 * @param {regexp} regex - The regular expression that specifies the rule.
 * @param {bo.commonRules.NullResultOption} option - The action to execute when the value is null.
 * @param {string} message - Human-readable description of the rule failure.
 * @param {number} [priority=100] - The priority of the rule.
 * @param {boolean} [stopsProcessing=false] - Indicates the rule behavior in case of failure.
 *
 * @extends bo.rules.ValidationRule
 *
 * @throws {@link bo.shared.ArgumentError Argument error}: The primary property must be a PropertyInfo object.
 * @throws {@link bo.shared.ArgumentError Argument error}: The regular expression must be a RegExp object.
 * @throws {@link bo.shared.ArgumentError Argument error}: The option must be a NullResultOption item.
 * @throws {@link bo.shared.ArgumentError Argument error}: The message must be a non-empty string.
 */
function ExpressionRule(primaryProperty, regex, option, message, priority, stopsProcessing) {
  ExpressionRule.super_.call(this, 'Expression');

  /**
   * The regular expression that the property value has to conform.
   * @type {number}
   * @readonly
   */
  this.regex = ensureArgument.isMandatoryType(regex, RegExp,
      'c_manType', 'ExpressionRule', 'regex');
  /**
   * The action to execute when the value of the property is null.
   * @type {number}
   * @readonly
   */
  this.option = ensureArgument.isEnumMember(option, NullResultOption, null,
      'c_enumMember', 'ExpressionRule', 'option', 'NullResultOption');

  // Initialize base properties.
  this.initialize(
      primaryProperty,
      message || t('expression', primaryProperty.name),
      priority,
      stopsProcessing
  );

  // Immutable object.
  Object.freeze(this);
}
util.inherits(ExpressionRule, ValidationRule);

/**
 * Checks if the value of the property matches the regular expression.
 *
 * @abstract
 * @function bo.commonRules.ExpressionRule#execute
 * @param {Array.<*>} inputs - An array of the values of the required properties.
 * @returns {(bo.rules.ValidationResult|undefined)} Information about the failure.
 */
ExpressionRule.prototype.execute = function (inputs) {

  var value = inputs[this.primaryProperty.name];
  var ruleIsSatisfied = false;

  if (value === null && this.option === NullResultOption.convertToEmptyString) {
    value = '';
  }
  if (value === null) {
    // If the value is null at this point,
    // then return the pre-defined result value.
    ruleIsSatisfied = (this.option === NullResultOption.returnTrue);
  } else {
    // The value is not null, so run the regular expression
    ruleIsSatisfied = this.regex.test(value.toString());
  }

  if (!ruleIsSatisfied)
    return this.result(this.message);
};

module.exports = ExpressionRule;
