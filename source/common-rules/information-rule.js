'use strict';

var util = require('util');
var ensureArgument = require('../shared/ensure-argument.js');
var ValidationRule = require('../rules/validation-rule.js');
var RuleSeverity = require('../rules/rule-severity.js');

function InformationRule(primaryProperty, message, priority, stopsProcessing) {
  InformationRule.super_.call(this, 'Information');

  ensureArgument.isMandatoryString(message,
      'The message argument of InformationRule constructor must be a non-empty string.');

  // Initialize base properties.
  this.initialize(
      primaryProperty,
      message,
      priority || 1,
      stopsProcessing || false
  );

  this.execute = function(inputs) {
    return this.result(this.message, RuleSeverity.information);
  };

  // Immutable object.
  Object.freeze(this);
}
util.inherits(InformationRule, ValidationRule);

InformationRule.prototype.execute = function (inputs) {
  return this.result(this.message, RuleSeverity.information);
};

module.exports = InformationRule;
