'use strict';

var util = require('util');
var ensureArgument = require('../shared/ensure-argument.js');
var ValidationRule = require('../rules/validation-rule.js');

function MinLengthRule(primaryProperty, minLength, message, priority, stopsProcessing) {
  MinLengthRule.super_.call(this, 'MinLength');

  this.initialize(primaryProperty, message, priority, stopsProcessing);

  this.minLength = ensureArgument.isMandatoryInteger(minLength,
    'The minLength argument of MinLengthRule constructor must be an integer value.');

  Object.freeze(this);
}
util.inherits(MinLengthRule, ValidationRule);

MinLengthRule.prototype.execute = function (inputs) {
  var value = inputs[this.primaryProperty.name];
  if (!value || value.toString().length < this.minLength)
    return this.result(this.message);
};

module.exports = MinLengthRule;
