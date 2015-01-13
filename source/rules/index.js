/*
 * Rule components' index module.
 */
'use strict';

var ValidationRule = require('./validation-rule.js');
var ValidationContext = require('./validation-context.js');
var ValidationResult = require('./validation-result.js');
var ValidationError = require('./validation-error.js');

var AuthorizationRule = require('./authorization-rule.js');
var AuthorizationContext = require('./authorization-context.js');
var AuthorizationResult = require('./authorization-result.js');
var AuthorizationError = require('./authorization-error.js');
var AuthorizationAction = require('./authorization-action.js');
var NoAccessBehavior = require('./no-access-behavior.js');

var RuleManager = require('./rule-manager.js');
var RuleList = require('./rule-list.js');
var RuleSeverity = require('./rule-severity.js');
var RuleBase = require('./rule-base.js');
var ResultBase = require('./result-base.js');

var BrokenRule = require('./broken-rule.js');
var BrokenRuleList = require('./broken-rule-list.js');
var BrokenRules = require('./broken-rules.js');

/**
 * List of rule components.
 *
 * @namespace bo/rules
 */
var index = {
  /**
   * Validation rule for editable models.
   * @memberof bo/rules
   * @see {@link module:rules/validation-rule} for further information.
   */
  ValidationRule: ValidationRule,
  /**
   * Validation context for validation rules.
   * @memberof bo/rules
   * @see {@link module:rules/validation-context} for further information.
   */
  ValidationContext: ValidationContext,
  /**
   * Validation result of validation rules.
   * @memberof bo/rules
   * @see {@link module:rules/validation-result} for further information.
   */
  ValidationResult: ValidationResult,
  /**
   * Validation error type.
   * @memberof bo/rules
   * @see {@link module:rules/validation-error} for further information.
   */
  ValidationError: ValidationError,


  /**
   * Authorization rule for models.
   * @memberof bo/rules
   * @see {@link module:rules/authorization-rule} for further information.
   */
  AuthorizationRule: AuthorizationRule,
  /**
   * Authorization context for authorization rules.
   * @memberof bo/rules
   * @see {@link module:rules/authorization-context} for further information.
   */
  AuthorizationContext: AuthorizationContext,
  /**
   * Authorization result of authorization rules.
   * @memberof bo/rules
   * @see {@link module:rules/authorization-result} for further information.
   */
  AuthorizationResult: AuthorizationResult,
  /**
   * Authorization error type.
   * @memberof bo/rules
   * @see {@link module:rules/authorization-error} for further information.
   */
  AuthorizationError: AuthorizationError,
  /**
   * Enumeration of authorization actions.
   * @memberof bo/rules
   * @see {@link module:rules/authorization-action} for further information.
   */
  AuthorizationAction: AuthorizationAction,
  /**
   * Enumeration of actions for unauthorized accesses.
   * @memberof bo/rules
   * @see {@link module:rules/authorization-action} for further information.
   */
  NoAccessBehavior: NoAccessBehavior,


  /**
   * Validates a model and check the permissions of the user.
   * @memberof bo/rules
   * @see {@link module:rules/rule-manager} for further information.
   */
  RuleManager: RuleManager,
  /**
   * Collection of rule definitions of a model.
   * @memberof bo/rules
   * @see {@link module:rules/rule-manager} for further information.
   */
  RuleList: RuleList,
  /**
   * Enumeration of rule severities.
   * @memberof bo/rules
   * @see {@link module:rules/rule-severity} for further information.
   */
  RuleSeverity: RuleSeverity,
  /**
   * Bsae object for rules.
   * @memberof bo/rules
   * @see {@link module:rules/rule-base} for further information.
   */
  RuleBase: RuleBase,
  /**
   * Bsae object for rule results.
   * @memberof bo/rules
   * @see {@link module:rules/result-base} for further information.
   */
  ResultBase: ResultBase,


  /**
   * Representation of a failed rule.
   * @memberof bo/rules
   * @see {@link module:rules/broken-rule} for further information.
   */
  BrokenRule: BrokenRule,
  /**
   * Collection of broken rules of a model.
   * @memberof bo/rules
   * @see {@link module:rules/broken-rule-list} for further information.
   */
  BrokenRuleList: BrokenRuleList,
  /**
   * Client side representation of broken rules.
   * @memberof bo/rules
   * @see {@link module:rules/broken-rules} for further information.
   */
  BrokenRules: BrokenRules
};

// Immutable object.
Object.freeze(index);

module.exports = index;
