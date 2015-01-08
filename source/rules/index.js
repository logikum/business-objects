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

var BrokenRules = require('./broken-rules.js');
var BrokenRuleList = require('./broken-rule-list.js');
var BrokenRule = require('./broken-rule.js');

var index = {
  ValidationRule: ValidationRule,
  ValidationContext: ValidationContext,
  ValidationResult: ValidationResult,
  ValidationError: ValidationError,

  AuthorizationRule: AuthorizationRule,
  AuthorizationContext: AuthorizationContext,
  AuthorizationResult: AuthorizationResult,
  AuthorizationError: AuthorizationError,
  AuthorizationAction: AuthorizationAction,
  NoAccessBehavior: NoAccessBehavior,

  RuleManager: RuleManager,
  RuleList: RuleList,
  RuleSeverity: RuleSeverity,
  RuleBase: RuleBase,
  ResultBase: ResultBase,

  BrokenRules: BrokenRules,
  BrokenRuleList: BrokenRuleList,
  BrokenRule: BrokenRule
};

// Immutable object.
Object.freeze(index);

module.exports = index;
