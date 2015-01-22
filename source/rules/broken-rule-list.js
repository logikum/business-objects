'use strict';

var ensureArgument = require('../shared/ensure-argument.js');
var PropertyInfo = require('../shared/property-info.js');
var BrokenRule = require('./broken-rule.js');
var BrokenRuleResponse = require('./broken-rule-response.js');
var RuleSeverity = require('./rule-severity.js');

/**
 * @classdesc Represents the lists of broken rules.
 * @description Creates a new broken rule list instance.
 *
 * @memberof bo.rules
 * @constructor
 * @param {string} modelName - The name of the model.
 *
 * @throws {@link bo.shared.ArgumentError Argument error}: The model name must be a non-empty string.
 */
var BrokenRuleList = function (modelName) {

  modelName = ensureArgument.isMandatoryString(modelName,
      'c_manString', 'BrokenRuleList', 'modelName');

  var items = {};
  var length = 0;

  /**
   * Adds a broken rule to the list.
   *
   * @param {bo.rules.BrokenRule} brokenRule - A broken rule to add.
   *
   * @throws {@link bo.shared.ArgumentError Argument error}: The rule must be a BrokenRule object.
   */
  this.add = function (brokenRule) {
    brokenRule = ensureArgument.isMandatoryType(brokenRule, BrokenRule,
        'm_manType', 'BrokenRuleList', 'add', 'brokenRule');

    if (items[brokenRule.propertyName])
      items[brokenRule.propertyName].push(brokenRule);
    else {
      items[brokenRule.propertyName] = new Array(brokenRule);
      length++;
    }
  };

  /**
   * Removes the broken rules of a property except of the retained ones.
   *
   * @param {string} propertyName - The name of the property that broken rules are deleted of.
   */
  function clearFor (propertyName) {
    if (items[propertyName]) {
      var preserved = items[propertyName].filter(function (item) {
        return item.isPreserved;
      });
      if (preserved.length)
        items[propertyName] = preserved;
      else {
        delete items[propertyName];
        length--;
      }
    }
  }

  /**
   * Removes the broken rules of a property except of the retained ones.
   * If property is omitted, all broken rules are removed
   * except of the retained ones.
   *
   * @param {bo.rules.PropertyInfo} [property] - A property definition.
   */
  this.clear = function (property) {
    if (property instanceof PropertyInfo)
      clearFor(property.name);
    else
      for (var propertyName in items) {
        if (items.hasOwnProperty(propertyName))
          clearFor(propertyName);
      }
  };

  /**
   * Removes the broken rules of a property, including retained ones.
   * If property is omitted, all broken rules are removed.
   *
   * @param property
   */
  this.clearAll = function (property) {
    if (property instanceof PropertyInfo) {
      delete items[property.name];
      length--;
    } else {
      items = {};
      length = 0;
    }
  };

  /**
   * Determines if the model is valid. The model is valid when it has no
   * broken rule with error severity.
   *
   * @returns {boolean} - True if the model is valid, otherwise false.
   */
  this.isValid = function () {
    for (var propertyName in items) {
      if (items.hasOwnProperty(propertyName)) {
        if (items[propertyName].some(function (item) {
              return item.severity === RuleSeverity.error;
            }))
          return false;
      }
    }
    return true;
  };

  /**
   * Transforms the broken rules into a format that can be sent to the client.
   *
   * @param {string} [namespace] - The namespace of the message keys when messages are localizable.
   * @returns {bo.rules.BrokenRuleResponse} The response object to send.
   *
   * @throws {@link bo.shared.ArgumentError Argument error}: The namespace must be a string.
   */
  this.output = function (namespace) {

    namespace = ensureArgument.isOptionalString(namespace,
        'm_optString', 'BrokenRuleList', 'output', 'namespace');

    var data = null;

    if (length) {
      data = new BrokenRuleResponse();

      var ns = namespace ? namespace + ':' : '';
      for (var property in items) {
        if (items.hasOwnProperty(property)) {
          items[property].forEach(function(brokenRule) {
            var propertyName = modelName + '.' + brokenRule.propertyName;
            var message = brokenRule.message || ns + propertyName + '.' + brokenRule.ruleName;
            data.add(propertyName, message, brokenRule.severity);
          });
        }
      }
      delete data.add;
      Object.freeze(data);
    }
    return data;
  };

  //Object.freeze(this);
};

module.exports = BrokenRuleList;
