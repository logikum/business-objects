'use strict';

var ValidationRule = require('./validation-rule.js');
var ValidationContext = require('./validation-context.js');
var ValidationResult = require('./validation-result.js');
var ValidationError = require('./validation-error.js');

var AuthorizationRule = require('./authorization-rule.js');
var AuthorizationContext = require('./authorization-context.js');
var AuthorizationResult = require('./authorization-result.js');
var AuthorizationAction = require('./authorization-action.js');

var RuleManager = require('./rule-manager.js');
var RuleList = require('./rule-list.js');
var RuleBase = require('./rule-base.js');
var ResultBase = require('./result-base.js');

var BrokenRules = require('./broken-rules.js');
var BrokenRuleList = require('./broken-rule-list.js');
var BrokenRule = require('./broken-rule.js');

var RuleSeverity = require('./rule-severity.js');
var NoAccessBehavior = require('./no-access-behavior.js');

var rules = {
  ValidationRule: ValidationRule,
  ValidationContext: ValidationContext,
  ValidationResult: ValidationResult,
  ValidationError: ValidationError,

  AuthorizationRule: AuthorizationRule,
  AuthorizationContext: AuthorizationContext,
  AuthorizationResult: AuthorizationResult,
  AuthorizationAction: AuthorizationAction,

  RuleManager: RuleManager,
  RuleList: RuleList,
  RuleBase: RuleBase,
  ResultBase: ResultBase,

  BrokenRules: BrokenRules,
  BrokenRuleList: BrokenRuleList,
  BrokenRule: BrokenRule,

  RuleSeverity: RuleSeverity,
  NoAccessBehavior: NoAccessBehavior
};

module.exports = rules;
