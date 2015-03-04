'use strict';

var CLASS_NAME = 'BrokenRulesOutput';

var EnsureArgument = require('../system/ensure-argument.js');
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

  var length = 0;

  /**
   * Returns the count of properties that have broken rules.
   *
   * @name BrokenRulesOutput#$length
   * @readonly
   */
  Object.defineProperty(this, '$length', {
    get: function () {
      return length;
    }
  });

  /**
   * Adds a broken rule item to the response object.
   *
   * @param {string} propertyName - The name of the property.
   * @param {string} message - The description or the message key of the broken rule.
   * @param {bo.rules.RuleSeverity} severity - The severity of the broken rule.
   *
   * @throws {@link bo.system.ArgumentError Argument error}: The property name must be a non-empty string.
   * @throws {@link bo.system.ArgumentError Argument error}: The message must be a non-empty string.
   * @throws {@link bo.system.ArgumentError Argument error}: The severity must be a RuleSeverity item.
   */
  this.add = function (propertyName, message, severity) {

    propertyName = EnsureArgument.isMandatoryString(propertyName,
        'm_manString', CLASS_NAME, 'add', 'propertyName');

    var brokenRule = {
      message: EnsureArgument.isMandatoryString(message,
          'm_manString', CLASS_NAME, 'add', 'message'),
      severity: EnsureArgument.isEnumMember(severity, RuleSeverity, null,
          'm_enumMember', CLASS_NAME, 'add', 'severity')
    };

    if (this[propertyName])
      this[propertyName].push(brokenRule);
    else {
      this[propertyName] = new Array(brokenRule);
      length++;
    }
  };

  this.addChild = function (propertyName, output) {

    propertyName = EnsureArgument.isMandatoryString(propertyName,
        'm_manString', CLASS_NAME, 'addChild', 'propertyName');
    output = EnsureArgument.isMandatoryType(output, BrokenRulesOutput,
        'm_manType', CLASS_NAME, 'addChild', 'output');

    this[propertyName] = output;
    length++;
  };

  this.addChildren = function (propertyName, outputs) {

    propertyName = EnsureArgument.isMandatoryString(propertyName,
        'm_manString', CLASS_NAME, 'addChildren', 'propertyName');
    outputs = EnsureArgument.isMandatoryArray(outputs, BrokenRulesOutput,
        'm_manArray', CLASS_NAME, 'addChildren', 'outputs');

    var list = {};

    outputs.forEach(function (output, index) {
      list[('00000' + index.toString()).slice(-5)] = output;
    });

    this[propertyName] = list;
    length++;
  };
}

module.exports = BrokenRulesOutput;
