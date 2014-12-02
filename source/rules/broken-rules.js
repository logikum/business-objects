'use strict';

var ensureArgument = require('../shared/ensure-argument.js');
var RuleSeverity = require('./rule-severity.js');

function BrokenRules () {

  this.add = function (propertyName, message, severity) {

    propertyName = ensureArgument.isMandatoryString(propertyName,
        'The propertyName argument of BrokenRules.add method must be a non-empty string.');

    var brokenRule = {
      message: ensureArgument.isMandatoryString(message,
          'The message argument of BrokenRules.add method must be a non-empty string.'),
      severity: ensureArgument.isEnumMember(severity, RuleSeverity, null,
          'The severity argument of BrokenRules.add method must be a RuleSeverity value.')
    };

    if (this[propertyName])
      this[propertyName].push(brokenRule);
    else
      this[propertyName] = new Array(brokenRule);
  };
}

module.exports = BrokenRules;
