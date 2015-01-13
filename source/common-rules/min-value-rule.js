/**
 * Min-value rule module.
 * @module common-rules/min-value-rule
 */
'use strict';

var util = require('util');
var t = require('../locales/i18n-bo.js')('Rules');
var ensureArgument = require('../shared/ensure-argument.js');
var ValidationRule = require('../rules/validation-rule.js');

function MinValueRule(primaryProperty, minValue, message, priority, stopsProcessing) {
  MinValueRule.super_.call(this, 'MinValue');

  this.minValue = ensureArgument.hasValue(minValue, 'c_required', 'MinValueRule', 'minValue');

  // Initialize base properties.
  this.initialize(
      primaryProperty,
      message || t('minValue', primaryProperty.name, minValue),
      priority,
      stopsProcessing
  );

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
