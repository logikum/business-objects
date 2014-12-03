'use strict';

var util = require('util');
var ensureArgument = require('../shared/ensure-argument.js');
var ValidationRule = require('../rules/validation-rule.js');

function LengthIsRule(primaryProperty, length, message, priority, stopsProcessing) {
  LengthIsRule.super_.call(this, 'LengthIs');

  this.initialize(primaryProperty, message, priority, stopsProcessing);

  this.length = ensureArgument.isMandatoryInteger(length,
    'The length argument of LengthIsRule constructor must be an integer value.');

  Object.freeze(this);
}
util.inherits(LengthIsRule, ValidationRule);

LengthIsRule.prototype.execute = function (inputs) {
  var value = inputs[this.primaryProperty.name];
  if (!value || value.toString().length !== this.length)
    return this.result(this.message);
};

module.exports = LengthIsRule;
