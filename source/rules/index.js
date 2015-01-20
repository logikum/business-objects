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
 * Contains components used by authorization and validation rules.
 *
 * @namespace bo.rules
 *
 * @property {function} AuthorizationError - {@link bo.rules.AuthorizationError Authorization error}
 *      constructor creates a new error related to a broken authorization rule.
 * @property {object} NoAccessBehavior - {@link bo.rules.NoAccessBehavior No access behavior}
 *      object specifies the behavior options of failed authorization rules.
 *
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
  RuleSeverity: RuleSeverity,
  RuleBase: RuleBase,
  ResultBase: ResultBase,

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
