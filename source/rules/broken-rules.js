/**
 * Broken rules module.
 * @module rules/broken-rules
 */
'use strict';

var ensureArgument = require('../shared/ensure-argument.js');
var RuleSeverity = require('./rule-severity.js');

function BrokenRules () {

  this.add = function (propertyName, message, severity) {

    propertyName = ensureArgument.isMandatoryString(propertyName,
        'm_manString', 'BrokenRules', 'add', 'propertyName');

    var brokenRule = {
      message: ensureArgument.isMandatoryString(message,
          'm_manString', 'BrokenRules', 'add', 'message'),
      severity: ensureArgument.isEnumMember(severity, RuleSeverity, null,
          'm_enumType', 'BrokenRules', 'add', 'severity')
    };

    if (this[propertyName])
      this[propertyName].push(brokenRule);
    else
      this[propertyName] = new Array(brokenRule);
  };
}

module.exports = BrokenRules;
