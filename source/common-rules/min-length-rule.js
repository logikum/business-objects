/**
 * Min-length rule module.
 * @module common-rules/min-length-rule
 */
'use strict';

var util = require('util');
var t = require('../locales/i18n-bo.js')('Rules');
var ensureArgument = require('../shared/ensure-argument.js');
var ValidationRule = require('../rules/validation-rule.js');

function MinLengthRule(primaryProperty, minLength, message, priority, stopsProcessing) {
  MinLengthRule.super_.call(this, 'MinLength');

  this.minLength = ensureArgument.isMandatoryInteger(minLength, 'c_manInteger', 'MinLengthRule', 'minLength');

  // Initialize base properties.
  this.initialize(
      primaryProperty,
      message || (minLength > 1 ?
        t('minLength', primaryProperty.name, minLength) :
        t('minLength1', primaryProperty.name)),
      priority,
      stopsProcessing
  );

  // Immutable object.
  Object.freeze(this);
}
util.inherits(MinLengthRule, ValidationRule);

MinLengthRule.prototype.execute = function (inputs) {

  var value = inputs[this.primaryProperty.name];

  if (!value || value.toString().length < this.minLength)
    return this.result(this.message);
};

module.exports = MinLengthRule;
