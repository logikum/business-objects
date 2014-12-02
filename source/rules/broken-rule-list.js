'use strict';

var ensureArgument = require('../shared/ensure-argument.js');
var PropertyInfo = require('../shared/property-info.js');
var BrokenRule = require('./broken-rule.js');
var BrokenRules = require('./broken-rules.js');
var RuleSeverity = require('./rule-severity.js');

var BrokenRuleList = function (modelName) {

  modelName = ensureArgument.isMandatoryString(modelName,
      'The modelName argument of BrokenRuleList constructor must be a non-empty string.');

  var items = {};
  var length = 0;

  this.add = function (brokenRule) {
    if (!(brokenRule instanceof BrokenRule))
      throw new Error('The brokenRule argument of BrokenRuleList.add method must be a BrokenRule object.');

    if (items[brokenRule.propertyName])
      items[brokenRule.propertyName].push(brokenRule);
    else {
      items[brokenRule.propertyName] = new Array(brokenRule);
      length++;
    }
  };

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

  this.clear = function (property) {
    if (property instanceof PropertyInfo)
      clearFor(property.name);
    else
      for (var propertyName in items) {
        if (items.hasOwnProperty(propertyName))
          clearFor(propertyName);
      }
  };

  this.clearAll = function (property) {
    if (property instanceof PropertyInfo) {
      delete items[property.name];
      length--;
    } else {
      items = {};
      length = 0;
    }
  };

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

  this.output = function (namespace) {

    if (namespace && typeof namespace !== 'string')
      throw new Error('The namespace argument of BrokenRuleList.output method must be a string.');

    var data = null;

    if (length) {
      data = new BrokenRules();

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
