'use strict';

var util = require('util');
var ensureArgument = require('../shared/ensure-argument.js');
var ValidationRule = require('../rules/validation-rule.js');

function MaxLengthRule(primaryProperty, maxLength, message, priority, stopsProcessing) {
  MaxLengthRule.super_.call(this, 'MaxLength');

  this.initialize(primaryProperty, message, priority, stopsProcessing);

  this.maxLength = ensureArgument.isMandatoryInteger(maxLength,
    'The maxLength argument of MaxLengthRule constructor must be an integer value.');

  Object.freeze(this);
}
util.inherits(MaxLengthRule, ValidationRule);

MaxLengthRule.prototype.execute = function (inputs) {
  var value = inputs[this.primaryProperty.name];
  if (value && value.toString().length > this.maxLength)
    return this.result(this.message);
};

module.exports = MaxLengthRule;
