'use strict';

var ensureArgument = require('../shared/ensure-argument.js');
var RuleSeverity = require('./rule-severity.js');

/**
 * @classdesc Represents the client side format of broken rules.
 * @description Creates a new broken rule response instance.
 *
 * @memberof bo.rules
 * @constructor
 */
function BrokenRuleResponse () {

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

    propertyName = ensureArgument.isMandatoryString(propertyName,
        'm_manString', 'BrokenRuleResponse', 'add', 'propertyName');

    var brokenRule = {
      message: ensureArgument.isMandatoryString(message,
          'm_manString', 'BrokenRuleResponse', 'add', 'message'),
      severity: ensureArgument.isEnumMember(severity, RuleSeverity, null,
          'm_enumType', 'BrokenRuleResponse', 'add', 'severity')
    };

    if (this[propertyName])
      this[propertyName].push(brokenRule);
    else
      this[propertyName] = new Array(brokenRule);
  };
}

module.exports = BrokenRuleResponse;
