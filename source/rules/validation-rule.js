'use strict';

var util = require('util');
var ensureArgument = require('../shared/ensure-argument.js');
var RuleBase = require('./rule-base.js');
var RuleSeverity = require('./rule-severity.js');
var ValidationResult = require('./validation-result.js');
var PropertyInfo = require('../shared/property-info.js');

function ValidationRule(ruleName) {
  ValidationRule.super_.call(this, ruleName);

  this.primaryProperty = null;

  this.initialize = function (primaryProperty, message, priority, stopsProcessing) {

    this.primaryProperty = ensureArgument.isMandatoryType(primaryProperty, PropertyInfo,
        'm_manType', 'ValidationRule', 'initialize', 'primaryProperty');

    // Initialize base properties.
    RuleBase.prototype.initialize.call(this, message, priority, stopsProcessing);
  };

  var inputProperties = [];
  var affectedProperties = [];

  this.addInputProperty = function (property) {
    property = ensureArgument.isMandatoryType(property, PropertyInfo,
        'm_manType', 'ValidationRule', 'addInputProperty', 'property');

    if (inputProperties.indexOf(property) < 0)
      inputProperties.push(property);
  };

  this.addAffectedProperty = function (property) {
    property = ensureArgument.isMandatoryType(property, PropertyInfo,
        'm_manType', 'ValidationRule', 'addAffectedProperty', 'property');

    if (affectedProperties.indexOf(property) < 0)
      affectedProperties.push(property);
  };

  this.getInputValues = function (getValue) {
    getValue = ensureArgument.isMandatoryFunction(getValue,
        'm_manFunction', 'ValidationRule', 'getInputValues', 'getValue');

    var inputValues = {};
    var combined = new Array(this.primaryProperty).concat(inputProperties);
    for (var i = 0; i < combined.length; i++) {
      var property = combined[i];
      inputValues[property.name] = getValue(property);
    }
    return inputValues;
  };

  this.result = function (message, severity) {

    var result = new ValidationResult(this.ruleName, this.primaryProperty.name, message || this.message);
    result.severity = ensureArgument.isEnumMember(severity, RuleSeverity, RuleSeverity.error,
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
