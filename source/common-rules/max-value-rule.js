/**
 * Max-value rule module.
 * @module common-rules/max-value-rule
 */
'use strict';

var util = require('util');
var t = require('../locales/i18n-bo.js')('Rules');
var ensureArgument = require('../shared/ensure-argument.js');
var ValidationRule = require('../rules/validation-rule.js');

function MaxValueRule(primaryProperty, maxValue, message, priority, stopsProcessing) {
  MaxValueRule.super_.call(this, 'MaxValue');

  this.maxValue = ensureArgument.hasValue(maxValue, 'c_required', 'MaxValueRule', 'maxValue');

  // Initialize base properties.
  this.initialize(
      primaryProperty,
      message || t('maxValue', primaryProperty.name, maxValue),
      priority,
      stopsProcessing
  );

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
