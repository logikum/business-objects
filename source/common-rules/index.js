/**
 * Common rules' index module.
 * @module common-rules/index
 */
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
 * List of common rules.
 *
 * @namespace bo/common-rules
 */
var index = {
  /**
   * Creator function for is-in-role rules.
   * @memberof bo/common-rules
   * @see {@link module:common-rules/is-in-role-rule} for further information.
   */
  isInRole: function (action, target, role, message, priority, stopsProcessing) {
    return new IsInRoleRule(action, target, role, message, priority, stopsProcessing);
  },
  /**
   * Creator function for is-in-any-role rules.
   * @memberof bo/common-rules
   * @see {@link module:common-rules/is-in-any-role-rule} for further information.
   */
  isInAnyRole: function (action, target, roles, message, priority, stopsProcessing) {
    return new IsInAnyRoleRule(action, target, roles, message, priority, stopsProcessing);
  },
  /**
   * Creator function for is-in-all-role rules.
   * @memberof bo/common-rules
   * @see {@link module:common-rules/is-in-all-role-rule} for further information.
   */
  isInAllRoles: function (action, target, roles, message, priority, stopsProcessing) {
    return new IsInAllRolesRule(action, target, roles, message, priority, stopsProcessing);
  },
  /**
   * Creator function for is-not-in-role rules.
   * @memberof bo/common-rules
   * @see {@link module:common-rules/is-not-in-role-rule} for further information.
   */
  isNotInRole: function (action, target, role, message, priority, stopsProcessing) {
    return new IsNotInRoleRule(action, target, role, message, priority, stopsProcessing);
  },
  /**
   * Creator function for is-not-in-any-role rules.
   * @memberof bo/common-rules
   * @see {@link module:common-rules/is-not-in-any-role-rule} for further information.
   */
  isNotInAnyRole: function (action, target, roles, message, priority, stopsProcessing) {
    return new IsNotInAnyRoleRule(action, target, roles, message, priority, stopsProcessing);
  },


  /**
   * Creator function for required rules.
   * @memberof bo/common-rules
   * @see {@link module:common-rules/required-rule} for further information.
   */
  required: function (primaryProperty, message, priority, stopsProcessing) {
    return new RequiredRule(primaryProperty, message, priority, stopsProcessing);
  },
  /**
   * Creator function for max-length rules.
   * @memberof bo/common-rules
   * @see {@link module:common-rules/max-length-rule} for further information.
   */
  maxLength: function (primaryProperty, maxLength, message, priority, stopsProcessing) {
    return new MaxLengthRule(primaryProperty, maxLength, message, priority, stopsProcessing);
  },
  /**
   * Creator function for min-length rules.
   * @memberof bo/common-rules
   * @see {@link module:common-rules/min-length-rule} for further information.
   */
  minLength: function (primaryProperty, minLength, message, priority, stopsProcessing) {
    return new MinLengthRule(primaryProperty, minLength, message, priority, stopsProcessing);
  },
  /**
   * Creator function for length-is rules.
   * @memberof bo/common-rules
   * @see {@link module:common-rules/length-is-rule} for further information.
   */
  lengthIs: function (primaryProperty, length, message, priority, stopsProcessing) {
    return new LengthIsRule(primaryProperty, length, message, priority, stopsProcessing);
  },
  /**
   * Creator function for max-value rules.
   * @memberof bo/common-rules
   * @see {@link module:common-rules/max-value-rule} for further information.
   */
  maxValue: function (primaryProperty, maxValue, message, priority, stopsProcessing) {
    return new MaxValueRule(primaryProperty, maxValue, message, priority, stopsProcessing);
  },
  /**
   * Creator function for min-value rules.
   * @memberof bo/common-rules
   * @see {@link module:common-rules/min-value-rule} for further information.
   */
  minValue: function (primaryProperty, minValue, message, priority, stopsProcessing) {
    return new MinValueRule(primaryProperty, minValue, message, priority, stopsProcessing);
  },
  /**
   * Creator function for expression rules.
   * @memberof bo/common-rules
   * @see {@link module:common-rules/expression-rule} for further information.
   */
  expression: function (primaryProperty, regex, option, message, priority, stopsProcessing) {
    return new ExpressionRule(primaryProperty, regex, option, message, priority, stopsProcessing);
  },
  /**
   * Creator function for dependency rules.
   * @memberof bo/common-rules
   * @see {@link module:common-rules/dependency-rule} for further information.
   */
  dependency: function (primaryProperty, dependencies, message, priority, stopsProcessing) {
    return new DependencyRule(primaryProperty, dependencies, message, priority, stopsProcessing);
  },
  /**
   * Creator function for information rules.
   * @memberof bo/common-rules
   * @see {@link module:common-rules/information-rule} for further information.
   */
  information: function (primaryProperty, message, priority, stopsProcessing) {
    return new InformationRule(primaryProperty, message, priority, stopsProcessing);
  },

  /**
   * Enumeration for expression rules in case of a null result.
   * @memberof bo/common-rules
   * @see {@link module:common-rules/null-result-option} for further information.
   */
  nullResultOption: NullResultOption
};

// Immutable object.
Object.freeze(index);

module.exports = index;
