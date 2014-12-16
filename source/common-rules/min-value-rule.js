'use strict';

var util = require('util');
var ensureArgument = require('../shared/ensure-argument.js');
var ValidationRule = require('../rules/validation-rule.js');

function MinValueRule(primaryProperty, minValue, message, priority, stopsProcessing) {
  MinValueRule.super_.call(this, 'MinValue');

  var defaultMessage ='The value of property ' + primaryProperty.name + ' has to be ' +  minValue + ' at least.';

  // Initialize base properties.
  this.initialize(
      primaryProperty,
      message || defaultMessage,
      priority,
      stopsProcessing
  );

  this.minValue = ensureArgument.hasValue(minValue,
    'The minValue argument of MinValueRule constructor is required.');

  // Immutable object.
  Object.freeze(this);
}
util.inherits(MinValueRule, ValidationRule);

MinValueRule.prototype.execute = function (inputs) {
  var value = inputs[this.primaryProperty.name];
  if (!value || value < this.minValue)
    return this.result(this.message);
};

module.exports = MinValueRule;
