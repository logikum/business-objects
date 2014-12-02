'use strict';

var ensureArgument = require('../shared/ensure-argument.js');
var RuleList = require('./rule-list.js');
//var ValidationRule = require('./validation-rule.js');
//var AuthorizationRule = require('./authorization-rule.js');
var NoAccessBehavior = require('./no-access-behavior.js');

var RuleManager = function () {

  var self = this;
  var validationRules = new RuleList();
  var authorizationRules = new RuleList();
  var noAccessBehavior = null;

  var args = Array.prototype.slice.call(arguments);
  args.forEach(function (arg) {
    self.add(arg);
  });

  Object.defineProperty(this, 'noAccessBehavior', {
    get: function () {
      return noAccessBehavior;
    },
    set: function (value) {
      NoAccessBehavior.check(value,
        'The value of RuleManager.noAccessBehavior property must be a NoAccessBehavior item.');
      noAccessBehavior = value;
    },
    enumeration: true
  });

  this.initialize = function (defaultBehavior) {
    validationRules.sort();
    authorizationRules.sort();
    authorizationRules.setNoAccessBehavior(noAccessBehavior || defaultBehavior);
  };

  this.add = function (rule) {
    if (rule instanceof ValidationRule) {
      validationRules.add(rule.primaryProperty.name, rule);
    } else if (rule instanceof AuthorizationRule) {
      authorizationRules.add(rule.getRuleId(), rule);
    } else
      throw new Error('The rule argument of RuleManager.add method must be a Rule object.');
  };

  this.validate = function (property, context) {
    context.brokenRules.clear(property);

    var rules = validationRules[property.name];
    if (rules) {
      for (var i = 0; i < rules.length; i++) {
        var rule = rules[i];

        var result = rule.execute(rule.getInputValues(context.propertyManager));

        if (result) {
          context.brokenRules.add(result.toBrokenRule());

          if (result.affectedProperties) {
            result.affectedProperties.forEach(function (affectedProperty) {
              self.validate(affectedProperty, context);
            });
          }
          if (result.stopsProcessing)
            break;
        }
      }
    }
  };

  this.hasPermission = function (context) {
    var isAllowed = true;

    var rules = authorizationRules[context.getRuleId()];
    if (rules) {
      for (var i = 0; i < rules.length; i++) {

        var result = rules[i].execute(context.user);

        if (result) {
          context.brokenRules.push(result.toBrokenRule());
          isAllowed = false;
          if (result.stopsProcessing)
            break;
        }
      }
    }
    return isAllowed;
  };

  // Immutable object.
  Object.freeze(this);
};

module.exports = RuleManager;
