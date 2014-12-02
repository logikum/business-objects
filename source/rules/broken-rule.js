'use strict';

var ensureArgument = require('../shared/ensure-argument.js');
var RuleSeverity = require('./rule-severity.js');

function BrokenRule(ruleName, isPreserved, propertyName, message, severity) {

  this.ruleName = ensureArgument.isMandatoryString(ruleName,
      'The ruleName argument of BrokenRule constructor must be a non-empty string.');
  this.isPreserved = ensureArgument.isMandatoryBoolean(isPreserved || false,
      'The isPreserved argument of BrokenRule constructor must be a Boolean value.');
  this.propertyName = ensureArgument.isOptionalString(propertyName || '',
      'The propertyName argument of BrokenRule constructor must be a string.');
  this.message = ensureArgument.isMandatoryString(message,
      'The message argument of BrokenRule constructor must be a non-empty string.');
  this.severity = ensureArgument.isEnumMember(severity, RuleSeverity, RuleSeverity.error,
      'The severity argument of BrokenRule constructor must be a RuleSeverity value.');
}

module.exports = BrokenRule;
