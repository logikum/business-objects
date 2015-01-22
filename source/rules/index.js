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
var BrokenRuleResponse = require('./broken-rule-response.js');

/**
 * Contains components used by authorization and validation rules.
 *
 * @namespace bo.rules
 *
 * @property {function} ValidationContext - {@link bo.rules.ValidationContext Validation context}
 *      constructor creates a new validation context instance.
 *
 * @property {function} AuthorizationContext - {@link bo.rules.AuthorizationContext Authorization context}
 *      constructor creates a new authorization context instance.
 * @property {function} AuthorizationError - {@link bo.rules.AuthorizationError Authorization error}
 *      constructor creates a new error related to a broken authorization rule.
 * @property {object} AuthorizationAction - {@link bo.rules.AuthorizationAction Authorization action}
 *      object specifies the operations of models to authorize.
 * @property {object} NoAccessBehavior - {@link bo.rules.NoAccessBehavior No access behavior}
 *      object specifies the behavior options of failed authorization rules.
 *
 * @property {function} RuleManager - {@link bo.rules.RuleManager Rule manager}
 *      constructor creates a new manager instance.
 * @property {function} RuleList - {@link bo.rules.RuleList Rule list}
 *      constructor creates a new rule list instance.
 * @property {object} RuleSeverity - {@link bo.rules.RuleSeverity Rule severity}
 *      object specifies the severity options of rule failures.
 * @property {function} RuleBase - {@link bo.rules.RuleBase Base rule}
 *      constructor creates a new base rule instance.
 * @property {function} ResultBase - {@link bo.rules.ResultBase Base rule result}
 *      constructor creates a new base rule result instance.
 *
 * @property {function} BrokenRule - {@link bo.rules.BrokenRule Broken rule}
 *      constructor creates a new broken rule instance.
 * @property {function} BrokenRuleList - {@link bo.rules.BrokenRuleList Broken rule list}
 *      constructor creates a new broken rule list instance.
 * @property {function} BrokenRuleResponse - {@link bo.rules.BrokenRuleResponse Broken rule response}
 *      constructor creates a new broken rule response instance.
 */
var index = {
  /**
   * Validation rule for editable models.
   * @memberof bo/rules
   * @see {@link module:rules/validation-rule} for further information.
   */
  ValidationRule: ValidationRule,
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
  AuthorizationContext: AuthorizationContext,
  /**
   * Authorization result of authorization rules.
   * @memberof bo/rules
   * @see {@link module:rules/authorization-result} for further information.
   */
  AuthorizationResult: AuthorizationResult,
  AuthorizationError: AuthorizationError,
  AuthorizationAction: AuthorizationAction,
  NoAccessBehavior: NoAccessBehavior,


  RuleManager: RuleManager,
  RuleList: RuleList,
  RuleSeverity: RuleSeverity,
  RuleBase: RuleBase,
  ResultBase: ResultBase,

  BrokenRule: BrokenRule,
  BrokenRuleList: BrokenRuleList,
  BrokenRuleResponse: BrokenRuleResponse
};

// Immutable object.
Object.freeze(index);

module.exports = index;
