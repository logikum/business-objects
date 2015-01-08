'use strict';

var ensureArgument = require('../shared/ensure-argument.js');
var RuleSeverity = require('./rule-severity.js');

function BrokenRule(ruleName, isPreserved, propertyName, message, severity) {

  this.ruleName = ensureArgument.isMandatoryString(ruleName,
      'c_manString', 'BrokenRule', 'ruleName');
  this.isPreserved = ensureArgument.isMandatoryBoolean(isPreserved || false,
      'c_manBoolean', 'BrokenRule' , 'isPreserved');
  this.propertyName = ensureArgument.isString(propertyName || '',
      'c_string', 'BrokenRule', 'propertyName');
  this.message = ensureArgument.isMandatoryString(message,
      'c_manString', 'BrokenRule', 'message');
  this.severity = ensureArgument.isEnumMember(severity, RuleSeverity, RuleSeverity.error,
      'c_enumType', 'BrokenRule', 'severity');
}

module.exports = BrokenRule;
