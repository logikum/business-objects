'use strict';

var util = require('util');
var t = require('../locales/i18n-bo.js')('Rules');
var ValidationRule = require('../rules/validation-rule.js');

function RequiredRule(primaryProperty, message, priority, stopsProcessing) {
  RequiredRule.super_.call(this, 'Required');

  // Initialize base properties.
  this.initialize(
      primaryProperty,
      message || t('required', primaryProperty.name),
      priority || 100,
      stopsProcessing
  );

  // Immutable object.
  Object.freeze(this);
}
util.inherits(RequiredRule, ValidationRule);

RequiredRule.prototype.execute = function (inputs) {

  var value = inputs[this.primaryProperty.name];

  if (!this.primaryProperty.type.hasValue(value))
    return this.result(this.message);
};

module.exports = RequiredRule;
