/**
 * Expression rule module.
 * @module common-rules/expression-rule
 */
'use strict';

var util = require('util');
var t = require('../locales/i18n-bo.js')('Rules');
var ensureArgument = require('../shared/ensure-argument.js');
var ValidationRule = require('../rules/validation-rule.js');
var NullResultOption = require('./null-result-option.js');

function ExpressionRule(primaryProperty, regex, option, message, priority, stopsProcessing) {
  ExpressionRule.super_.call(this, 'Expression');

  this.regex = ensureArgument.isMandatoryType(regex, RegExp,
      'c_manType', 'ExpressionRule', 'regex');
  this.option = ensureArgument.isEnumMember(option, NullResultOption, null,
      'c_enumMember', 'ExpressionRule', 'option', 'NullResultOption');

  // Initialize base properties.
  this.initialize(
      primaryProperty,
      message || t('expression', primaryProperty.name),
      priority,
      stopsProcessing
  );

  // Immutable object.
  Object.freeze(this);
}
util.inherits(ExpressionRule, ValidationRule);

ExpressionRule.prototype.execute = function (inputs) {

  var value = inputs[this.primaryProperty.name];
  var ruleIsSatisfied = false;

  if (value === null && this.option === NullResultOption.convertToEmptyString) {
    value = '';
  }
  if (value === null) {
    // If the value is null at this point,
    // then return the pre-defined result value.
    ruleIsSatisfied = (this.option === NullResultOption.returnTrue);
  } else {
    // the value is not null, so run the regular expression
    ruleIsSatisfied = this.regex.test(value.toString());
  }

  if (!ruleIsSatisfied)
    return this.result(this.message);
};

module.exports = ExpressionRule;
