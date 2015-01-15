'use strict';

var IsInRoleRule = require('./is-in-role-rule.js');
var IsInAnyRoleRule = require('./is-in-any-role-rule.js');
var IsInAllRolesRule = require('./is-in-all-roles-rule.js');
var IsNotInRoleRule = require('./is-not-in-role-rule.js');
var IsNotInAnyRoleRule = require('./is-not-in-any-role-rule.js');

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

/**
 * Contains implementations of frequently used rules.
 *
 * @namespace bo.commonRules
 *
 * @property {function} isInRole - Creator function for {@link bo.commonRules.IsInRoleRule is-in-role} rules.
 * @property {function} isInAnyRole - Creator function for {@link bo.commonRules.IsInAnyRoleRule is-in-any-role} rules.
 * @property {function} isInAllRoles - Creator function for {@link bo.commonRules.IsInAllRolesRule is-in-all-role} rules.
 * @property {function} isNotInRole - Creator function for {@link bo.commonRules.IsNotInRoleRule is-not-in-role} rules.
 * @property {function} isNotInAnyRole - Creator function for {@link bo.commonRules.IsNotInAnyRoleRule is-not-in-any-role} rules.
 *
 * @property {function} required - Creator function for {@link bo.commonRules.RequiredRule required} rules.
 * @property {function} maxLength - Creator function for {@link bo.commonRules.MaxLengthRule max-length} rules.
 * @property {function} minLength - Creator function for {@link bo.commonRules.MinLengthRule min-length} rules.
 * @property {function} lengthIs - Creator function for {@link bo.commonRules.LengthIsRule length-is} rules.
 * @property {function} maxValue - Creator function for {@link bo.commonRules.MaxValueRule max-value} rules.
 * @property {function} minValue - Creator function for {@link bo.commonRules.MinValueRule min-value} rules.
 * @property {function} expression - Creator function for {@link bo.commonRules.ExpressionRule expression} rules.
 * @property {function} dependency - Creator function for {@link bo.commonRules.DependencyRule dependency} rules.
 * @property {function} information - Creator function for {@link bo.commonRules.InformationRule information} rules.
 *
 * @property {object} nullResultOption - Enumeration of expression rule actions in case of a {@link bo.commonRules.NullResultOption null value}.
 */
var index = {
  isInRole: function (action, target, role, message, priority, stopsProcessing) {
    return new IsInRoleRule(action, target, role, message, priority, stopsProcessing);
  },
  isInAnyRole: function (action, target, roles, message, priority, stopsProcessing) {
    return new IsInAnyRoleRule(action, target, roles, message, priority, stopsProcessing);
  },
  isInAllRoles: function (action, target, roles, message, priority, stopsProcessing) {
    return new IsInAllRolesRule(action, target, roles, message, priority, stopsProcessing);
  },
  isNotInRole: function (action, target, role, message, priority, stopsProcessing) {
    return new IsNotInRoleRule(action, target, role, message, priority, stopsProcessing);
  },
  isNotInAnyRole: function (action, target, roles, message, priority, stopsProcessing) {
    return new IsNotInAnyRoleRule(action, target, roles, message, priority, stopsProcessing);
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

// Immutable object.
Object.freeze(index);

module.exports = index;
