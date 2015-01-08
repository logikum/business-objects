'use strict';

var util = require('util');
var t = require('../locales/i18n-bo.js')('Rules');
var ensureArgument = require('../shared/ensure-argument.js');
var ValidationRule = require('../rules/validation-rule.js');

function LengthIsRule(primaryProperty, length, message, priority, stopsProcessing) {
  LengthIsRule.super_.call(this, 'LengthIs');

  this.length = ensureArgument.isMandatoryInteger(length, 'c_manInteger', 'LengthIsRule', 'length');

  // Initialize base properties.
  this.initialize(
      primaryProperty,
      message || (length > 1 ?
        t('lengthIs', primaryProperty.name, length) :
        t('lengthIs1', primaryProperty.name)),
      priority,
      stopsProcessing
  );

  // Immutable object.
  Object.freeze(this);
}
util.inherits(LengthIsRule, ValidationRule);

LengthIsRule.prototype.execute = function (inputs) {

  var value = inputs[this.primaryProperty.name];

  if (!value || value.toString().length !== this.length)
    return this.result(this.message);
};

module.exports = LengthIsRule;
