'use strict';

var util = require('util');
var t = require('../locales/i18n-bo.js')('Rules');
var ensureArgument = require('../shared/ensure-argument.js');
var ValidationRule = require('../rules/validation-rule.js');

function MaxLengthRule(primaryProperty, maxLength, message, priority, stopsProcessing) {
  MaxLengthRule.super_.call(this, 'MaxLength');

  this.maxLength = ensureArgument.isMandatoryInteger(maxLength, 'c_manInteger', 'MaxLengthRule', 'maxLength');

  // Initialize base properties.
  this.initialize(
      primaryProperty,
      message || (maxLength > 1 ?
        t('maxLength', primaryProperty.name, maxLength) :
        t('maxLength1', primaryProperty.name)),
      priority,
      stopsProcessing
  );

  // Immutable object.
  Object.freeze(this);
}
util.inherits(MaxLengthRule, ValidationRule);

MaxLengthRule.prototype.execute = function (inputs) {

  var value = inputs[this.primaryProperty.name];

  if (value && value.toString().length > this.maxLength)
    return this.result(this.message);
};

module.exports = MaxLengthRule;
