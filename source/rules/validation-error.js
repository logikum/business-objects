'use strict';

var ensureArgument = require('../shared/ensure-argument.js');
var BrokenRules = require('./broken-rules.js');
var RuleSeverity = require('./rule-severity.js');

function ValidationError(brokenRules, message) {

  brokenRules = ensureArgument.isMandatoryType(brokenRules, BrokenRules,
    'The brokenRules argument of ValidationError constructor must be a BrokenRules object.');

  this.name = 'ValidationError';
  this.status = 422;
  this.message = message || 'The model is invalid.';
  this.message = ensureArgument.isString(message || 'The model is invalid.',
    'The message argument of BrokenRuleList.toError method must be a string.');
  this.data = {};
  this.count = 0;

  for (var property in brokenRules) {
    if (brokenRules.hasOwnProperty(property)) {
      var errors = brokenRules[property].filter(function (brokenRule) {
        return brokenRule.severity === RuleSeverity.error;
      });
      if (errors.length) {
        this.data[property] = errors;
        this.count += errors.length;
      }
    }
  }

  Object.freeze(this);
}

module.exports = ValidationError;
