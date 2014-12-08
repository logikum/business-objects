'use strict';

var IsInRoleRule = require('./is-in-role-rule.js');
var IsNotInRoleRule = require('./is-not-in-role-rule.js');

var RequiredRule = require('./required-rule.js');
var MaxLengthRule = require('./max-length-rule.js');
var MinLengthRule = require('./min-length-rule.js');
var LengthIsRule = require('./length-is-rule.js');
var MaxValueRule = require('./max-value-rule.js');
var MinValueRule = require('./min-value-rule.js');
var ExpressionRule = require('./expression-rule.js');
var DependencyRule = require('./dependency-rule.js');
var InformationRule = require('./information-rule.js');
var NullResultOption = require('./null-result-option.js');

var index = {
  isInRole: function (action, target, roles, message, priority, stopsProcessing) {
    return new IsInRoleRule(action, target, roles, message, priority, stopsProcessing);
  },
  isNotInRole: function (action, target, roles, message, priority, stopsProcessing) {
    return new IsNotInRoleRule(action, target, roles, message, priority, stopsProcessing);
  },

  required: function (primaryProperty, message, priority, stopsProcessing) {
    return new RequiredRule(primaryProperty, message, priority, stopsProcessing);
  },
  maxLength: function (primaryProperty, maxLength, message, priority, stopsProcessing) {
    return new MaxLengthRule(primaryProperty, maxLength, message, priority, stopsProcessing);
  },
  minLength: function (primaryProperty, minLength, message, priority, stopsProcessing) {
    return new MinLengthRule(primaryProperty, minLength, message, priority, stopsProcessing);
  },
  lengthIs: function (primaryProperty, length, message, priority, stopsProcessing) {
    return new LengthIsRule(primaryProperty, length, message, priority, stopsProcessing);
  },
  maxValue: function (primaryProperty, maxValue, message, priority, stopsProcessing) {
    return new MaxValueRule(primaryProperty, maxValue, message, priority, stopsProcessing);
  },
  minValue: function (primaryProperty, minValue, message, priority, stopsProcessing) {
    return new MinValueRule(primaryProperty, minValue, message, priority, stopsProcessing);
  },
  expression: function (primaryProperty, regex, option, message, priority, stopsProcessing) {
    return new ExpressionRule(primaryProperty, regex, option, message, priority, stopsProcessing);
  },
  dependency: function (primaryProperty, dependencies, message, priority, stopsProcessing) {
    return new DependencyRule(primaryProperty, dependencies, message, priority, stopsProcessing);
  },
  information: function (primaryProperty, message, priority, stopsProcessing) {
    return new InformationRule(primaryProperty, message, priority, stopsProcessing);
  },

  nullResultOption: NullResultOption
};

Object.freeze(index);

module.exports = index;
