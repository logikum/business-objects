/**
 * Validation error module.
 * @module rules/validation-error
 */
'use strict';

var t = require('../locales/i18n-bo.js')('Rules');
var ensureArgument = require('../shared/ensure-argument.js');
var BrokenRuleResponse = require('./broken-rule-response.js');
var RuleSeverity = require('./rule-severity.js');

function ValidationError(brokenRules, message) {

  brokenRules = ensureArgument.isMandatoryType(brokenRules, BrokenRuleResponse,
      'c_manType', 'ValidationError', 'brokenRules');

  this.name = 'ValidationError';
  this.status = 422;
  this.message = ensureArgument.isString(message || t('invalid'),
      'c_string', 'ValidationError', 'message');
  this.data = {};
  this.count = 0;

  for (var property in brokenRules) {
    if (brokenRules.hasOwnProperty(property) && brokenRules[property] instanceof Array) {
      var errors = brokenRules[property].filter(function (brokenRule) {
        return brokenRule.severity === RuleSeverity.error;
      });
      if (errors.length) {
        this.data[property] = errors;
        this.count += errors.length;
      }
    }
  }

  // Immutable object.
  Object.freeze(this);
}

module.exports = ValidationError;
