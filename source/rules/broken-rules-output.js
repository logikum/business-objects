'use strict';

var CLASS_NAME = 'BrokenRulesOutput';

var EnsureArgument = require('../system/ensure-argument.js');
var RuleNotice = require('./rule-notice.js');
var RuleSeverity = require('./rule-severity.js');

/**
 * @classdesc
 *      Represents the public format of broken rules. The output object
 *      has a property for each model property that has broken rule.
 *
 *      If the model property is a simple property, i.e. it is defined by
 *      a {@link bo.dataTypes.DataType data type}, then the output property
 *      is an array. The array elements are {@link bo.rules.RuleNotice rule notice}
 *      objects representing the broken rules.
 *
 *      If the model property is a child model, then the output property
 *      is an object as well, whose properties represents model properties
 *      with broken rules, as described above.
 *
 *      If the model property is a child collection, then the output property
 *      is an object as well, whose properties are the indeces of the items of
 *      the collections. The property name is a number in '00000' format. The
 *      property value represents the child item, as described above.
 * @description
 *      Creates a new broken rules output instance.
 *
 * @memberof bo.rules
 * @constructor
 */
function BrokenRulesOutput () {

  var self = this;
  var length = 0;
  var count = 0;
  var childObjects = [];
  var childCollections = [];

  /**
   * Returns the count of properties that have broken rules.
   * @name BrokenRulesOutput#$length
   * @readonly
   */
  Object.defineProperty(this, '$length', {
    get: function () {
      return length;
    },
    enumerable: false
  });

  /**
   * Returns the count of broken rules.
   * @name BrokenRulesOutput#$count
   * @readonly
   */
  Object.defineProperty(this, '$count', {
    get: function () {
      var total = count;

      // Add notice counts of child objects.
      childObjects.forEach(function (childName) {
        total += self[childName].$count;
      });

      // Add notice counts of child collection items.
      childCollections.forEach(function (collectionName) {
        var collection = self[collectionName];
        for (var index in collection) {
          if (collection.hasOwnProperty(index))
            total += collection[index].$count;
        }
      });

      return total;
    },
    enumerable: false
  });

  /**
   * Adds a rule notice to the response object.
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
    count++;
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
    childObjects.push(propertyName);
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
      //list[index.toString()] = output;
    });

    this[propertyName] = list;
    childCollections.push(propertyName);
    length++;
  };
}

module.exports = BrokenRulesOutput;
