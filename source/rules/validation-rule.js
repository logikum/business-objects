'use strict';

var util = require('util');
var ensureArgument = require('../shared/ensure-argument.js');
var RuleBase = require('./rule-base.js');
var RuleSeverity = require('./rule-severity.js');
var ValidationResult = require('./validation-result.js');
var PropertyInfo = require('../shared/property-info.js');

function ValidationRule(ruleName) {
  ValidationRule.super_.call(this);

  this.ruleName = ensureArgument.isMandatoryString(ruleName,
    'The ruleName argument of ValidationRule constructor must be a non-empty string.');
  this.primaryProperty = null;

  this.initialize = function (primaryProperty, message, priority, stopsProcessing) {

    this.primaryProperty = ensureArgument.isMandatoryType(primaryProperty, PropertyInfo,
      'The primaryProperty argument of ValidationRule.initialize method must be a PropertyInfo object.');

    // Initialize base properties.
    RuleBase.prototype.initialize.call(this, message, priority, stopsProcessing);
  };

  var inputProperties = [];
  var affectedProperties = [];

  function addProperty (array, property, message) {
    property = ensureArgument.isMandatoryType(property, PropertyInfo, message);

    if (array.indexOf(property) < 0)
      array.push(property);
  }

  this.addInputProperty = function (property) {
    addProperty(inputProperties, property,
      'The property argument of ValidationRule.addInputProperty method must be a property info object.');
  };

  this.addAffectedProperty = function (property) {
    addProperty(affectedProperties, property,
      'The property argument of ValidationRule.addAffectedProperty method must be a property info object.');
  };

  this.getInputValues = function (getValue) {
    getValue = ensureArgument.isMandatoryFunction(getValue,
      'The getValue argument of ValidationRule.getInputValues method must be a function.');

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
      'The severity argument of ValidationRule.result method must be a RuleSeverity value.');
    result.stopsProcessing = this.stopsProcessing;
    result.isPreserved = false;
    result.affectedProperties = affectedProperties;

    return result;
  };

  Object.freeze(ValidationRule);
}
util.inherits(ValidationRule, RuleBase);

module.exports = ValidationRule;
