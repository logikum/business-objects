'use strict';

var util = require('util');
var EnsureArgument = require('../system/ensure-argument.js');
var RuleBase = require('./rule-base.js');
var RuleSeverity = require('./rule-severity.js');
var ValidationResult = require('./validation-result.js');
var PropertyInfo = require('../shared/property-info.js');

/**
 * @classdesc
 *      Represents a validation rule.
 * @description
 *      Creates a new validation rule object.
 *      The rule instances should be frozen.
 *
 * @memberof bo.rules
 * @constructor
 * @param {string} ruleName - The name of the rule.
 *    It is typically the name of the constructor, without the Rule suffix.
 *
 * @extends bo.rules.RuleBase
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The rule name must be a non-empty string.
 */
function ValidationRule(ruleName) {
  RuleBase.call(this, ruleName);

  /**
   * The definition of the property the rule relates to.
   * @type {bo.shared.PropertyInfo}
   * @readonly
   */
  this.primaryProperty = null;

  /**
   * Sets the properties of the rule.
   *
   * @param {bo.shared.PropertyInfo} primaryProperty - The property definition the rule relates to.
   * @param {string} message - Human-readable description of the rule failure.
   * @param {number} [priority=10] - The priority of the rule.
   * @param {boolean} [stopsProcessing=false] - Indicates the rule behavior in case of failure.
   *
   * @throws {@link bo.system.ArgumentError Argument error}: The primary property must be a PropertyInfo object.
   * @throws {@link bo.system.ArgumentError Argument error}: The message must be a non-empty string.
   */
  this.initialize = function (primaryProperty, message, priority, stopsProcessing) {

    this.primaryProperty = EnsureArgument.isMandatoryType(primaryProperty, PropertyInfo,
        'm_manType', 'ValidationRule', 'initialize', 'primaryProperty');

    // Initialize base properties.
    RuleBase.prototype.initialize.call(this, message, priority, stopsProcessing);
  };

  var inputProperties = [];
  var affectedProperties = [];

  /**
   * Adds an additional property to the rule that will use its value.
   *
   * @param {bo.shared.PropertyInfo} property - An input property that value is used by the rule of.
   *
   * @throws {@link bo.system.ArgumentError Argument error}: The input property must be a PropertyInfo object.
   */
  this.addInputProperty = function (property) {
    property = EnsureArgument.isMandatoryType(property, PropertyInfo,
        'm_manType', 'ValidationRule', 'addInputProperty', 'property');

    if (inputProperties.indexOf(property) < 0)
      inputProperties.push(property);
  };

  /**
   * Adds an additional property that is influenced by the rule.
   *
   * @param {bo.shared.PropertyInfo} property - An affected property influenced by the rule.
   *
   * @throws {@link bo.system.ArgumentError Argument error}: The affected property must be a PropertyInfo object.
   */
  this.addAffectedProperty = function (property) {
    property = EnsureArgument.isMandatoryType(property, PropertyInfo,
        'm_manType', 'ValidationRule', 'addAffectedProperty', 'property');

    if (affectedProperties.indexOf(property) < 0)
      affectedProperties.push(property);
  };

  /**
   * Returns the values of the properties that are used by the rule.
   *
   * @param {internal~getValue} getValue - A function that returns the value of a property.
   * @returns {object} An object that properties hold the values of the input properties of.
   *
   * @throws {@link bo.system.ArgumentError Argument error}: The getValue argument must be a function..
   */
  this.getInputValues = function (getValue) {
    getValue = EnsureArgument.isMandatoryFunction(getValue,
        'm_manFunction', 'ValidationRule', 'getInputValues', 'getValue');

    var inputValues = {};
    var combined = new Array(this.primaryProperty).concat(inputProperties);
    for (var i = 0; i < combined.length; i++) {
      var property = combined[i];
      inputValues[property.name] = getValue(property);
    }
    return inputValues;
  };

  /**
   * Returns the result of the rule executed.
   *
   * @param {string} [message] - Human-readable description of the rule failure.
   * @param {bo.rules.RuleSeverity} severity - The severity of the failed rule.
   * @returns {bo.rules.ValidationResult} The result of the validation rule.
   */
  this.result = function (message, severity) {

    var result = new ValidationResult(this.ruleName, this.primaryProperty.name, message || this.message);
    result.severity = EnsureArgument.isEnumMember(severity, RuleSeverity, RuleSeverity.error,
        'm_manFunction', 'ValidationRule', 'result', 'severity');
    result.stopsProcessing = this.stopsProcessing;
    result.isPreserved = false;
    result.affectedProperties = affectedProperties;

    return result;
  };

  // Immutable object.
  Object.freeze(ValidationRule);
}
util.inherits(ValidationRule, RuleBase);

module.exports = ValidationRule;
