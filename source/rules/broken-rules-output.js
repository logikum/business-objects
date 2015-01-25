'use strict';

var EnsureArgument = require('../shared/ensure-argument.js');
var RuleSeverity = require('./rule-severity.js');

/**
 * @classdesc
 *      Represents the public format of broken rules.
 *      The object properties are arrays, one for each model property that
 *      has broken rule. The array elements are objects with a message and
 *      a severity property, representing the broken rules.
 * @description
 *      Creates a new broken rules output instance.
 *
 * @memberof bo.rules
 * @constructor
 */
function BrokenRulesOutput () {

  /**
   * Adds a broken rule item to the response object.
   *
   * @param {string} propertyName - The name of the property.
   * @param {string} message - The description or the message key of the broken rule.
   * @param {bo.rules.RuleSeverity} severity - The severity of the broken rule.
   *
   * @throws {@link bo.shared.ArgumentError Argument error}: The property name must be a non-empty string.
   * @throws {@link bo.shared.ArgumentError Argument error}: The message must be a non-empty string.
   * @throws {@link bo.shared.ArgumentError Argument error}: The severity must be a RuleSeverity item.
   */
  this.add = function (propertyName, message, severity) {

    propertyName = EnsureArgument.isMandatoryString(propertyName,
        'm_manString', 'BrokenRulesOutput', 'add', 'propertyName');

    var brokenRule = {
      message: EnsureArgument.isMandatoryString(message,
          'm_manString', 'BrokenRulesOutput', 'add', 'message'),
      severity: EnsureArgument.isEnumMember(severity, RuleSeverity, null,
          'm_enumType', 'BrokenRulesOutput', 'add', 'severity')
    };

    if (this[propertyName])
      this[propertyName].push(brokenRule);
    else
      this[propertyName] = new Array(brokenRule);
  };
}

module.exports = BrokenRulesOutput;
