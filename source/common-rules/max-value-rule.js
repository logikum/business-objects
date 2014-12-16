'use strict';

var util = require('util');
var ensureArgument = require('../shared/ensure-argument.js');
var ValidationRule = require('../rules/validation-rule.js');

function MaxValueRule(primaryProperty, maxValue, message, priority, stopsProcessing) {
  MaxValueRule.super_.call(this, 'MaxValue');

  var defaultMessage ='The value of property ' + primaryProperty.name + ' cannot exceed ' +  maxValue + '.';

  // Initialize base properties.
  this.initialize(
      primaryProperty,
      message || defaultMessage,
      priority,
      stopsProcessing
  );

  this.maxValue = ensureArgument.hasValue(maxValue,
    'The maxValue argument of MaxValueRule constructor is required.');

  // Immutable object.
  Object.freeze(this);
}
util.inherits(MaxValueRule, ValidationRule);

MaxValueRule.prototype.execute = function (inputs) {
  var value = inputs[this.primaryProperty.name];
  if (value && value > this.maxValue)
    return this.result(this.message);
};

module.exports = MaxValueRule;
