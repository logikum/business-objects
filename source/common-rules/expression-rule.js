'use strict';

var util = require('util');
var ensureArgument = require('../shared/ensure-argument.js');
var ValidationRule = require('../rules/validation-rule.js');
var NullResultOption = require('./null-result-option.js');

function ExpressionRule(primaryProperty, regex, option, message, priority, stopsProcessing) {
  ExpressionRule.super_.call(this, 'Expression');

  this.initialize(primaryProperty, message, priority, stopsProcessing);

  this.regex = ensureArgument.isMandatoryType(regex, RegExp,
    'The regex argument of ExpressionRule constructor must be a RegExp object.');
  this.option = ensureArgument.isEnumMember(option, NullResultOption, null,
    'The option argument of ExpressionRule constructor must be a NullResultOption value.');

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
    // if the value is null at this point
    // then return the pre-defined result value
    ruleIsSatisfied = (this.option === NullResultOption.returnTrue);
  } else {
    // the value is not null, so run the regular expression
    ruleIsSatisfied = this.regex.test(value.toString());
  }

  if (!ruleIsSatisfied)
    return this.result(this.message);
};

module.exports = ExpressionRule;
