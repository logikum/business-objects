'use strict';

var CLASS_NAME = 'BrokenRulesOutput';

var EnsureArgument = require('../system/ensure-argument.js');
var RuleNotice = require('./rule-notice.js');
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
   * @param {bo.rules.RuleNotice} notice - The public form of the broken rule.
   *
   * @throws {@link bo.system.ArgumentError Argument error}: The property name must be a non-empty string.
   * @throws {@link bo.system.ArgumentError Argument error}: The notice must be a RuleNotice object.
   */
  this.add = function (propertyName, notice) {

    propertyName = EnsureArgument.isMandatoryString(propertyName,
        'm_manString', CLASS_NAME, 'add', 'propertyName');
    notice = EnsureArgument.isMandatoryType(notice, RuleNotice,
        'm_manType', CLASS_NAME, 'add', 'notice');

    if (this[propertyName])
      this[propertyName].push(notice);
    else {
      this[propertyName] = new Array(notice);
      length++;
    }
  };

  /**
   * Adds a child response object to the response object.
   *
   * @param {string} propertyName - The name of the property.
   * @param {bo.rules.BrokenRulesOutput} output - The response object of a child property.
   *
   * @throws {@link bo.system.ArgumentError Argument error}: The property name must be a non-empty string.
   * @throws {@link bo.system.ArgumentError Argument error}: The output must be a BrokenRulesOutput object.
   */
  this.addChild = function (propertyName, output) {

    propertyName = EnsureArgument.isMandatoryString(propertyName,
        'm_manString', CLASS_NAME, 'addChild', 'propertyName');
    output = EnsureArgument.isMandatoryType(output, BrokenRulesOutput,
        'm_manType', CLASS_NAME, 'addChild', 'output');

    this[propertyName] = output;
    length++;
  };

  /**
   * Adds child response objects to the response object.
   *
   * @param {string} propertyName - The name of the property.
   * @param {Array.<bo.rules.BrokenRulesOutput>} outputs - The response objects of a child collection property.
   *
   * @throws {@link bo.system.ArgumentError Argument error}: The property name must be a non-empty string.
   * @throws {@link bo.system.ArgumentError Argument error}:
   *    The outputs must be an array of BrokenRulesOutput objects or a single BrokenRulesOutput object.
   */
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
