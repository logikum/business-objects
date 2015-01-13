/**
 * Rule manager module.
 * @module rules/rule-manager
 */
'use strict';

var ensureArgument = require('../shared/ensure-argument.js');
var ArgumentError = require('../shared/argument-error.js');
var RuleList = require('./rule-list.js');
var ValidationRule = require('./validation-rule.js');
var ValidationContext = require('./validation-context.js');
var AuthorizationRule = require('./authorization-rule.js');
var RuleSeverity = require('./rule-severity.js');
var NoAccessBehavior = require('./no-access-behavior.js');
var PropertyInfo = require('../shared/property-info.js');

var RuleManager = function () {

  var self = this;
  var validationRules = new RuleList();
  var authorizationRules = new RuleList();
  var noAccessBehavior = null;

  Object.defineProperty(this, 'noAccessBehavior', {
    get: function () {
      return noAccessBehavior;
    },
    set: function (value) {
      noAccessBehavior = ensureArgument.isEnumMember(value, NoAccessBehavior, NoAccessBehavior.throwError,
          'p_enumType', 'RuleManager', 'noAccessBehavior');
    },
    enumeration: true
  });

  this.initialize = function (defaultBehavior) {
    this.noAccessBehavior = defaultBehavior;
    validationRules.sort();
    authorizationRules.sort();

    for (var id in authorizationRules) {
      if (authorizationRules.hasOwnProperty(id) && authorizationRules[id] instanceof Array) {
        authorizationRules[id].forEach(function (rule) {
          rule.noAccessBehavior = noAccessBehavior;
        });
      }
    }
  };

  this.add = function (rule) {

    if (rule instanceof ValidationRule) {
      if (!rule.primaryProperty)
        throw new ArgumentError('m_notInit', 'RuleManager', 'add', 'rule');
      validationRules.add(rule.primaryProperty.name, rule);

    } else if (rule instanceof AuthorizationRule) {
      if (!rule.ruleId)
        throw new ArgumentError('m_notInit', 'RuleManager', 'add', 'rule');
      authorizationRules.add(rule.ruleId, rule);

    } else
      throw new ArgumentError('m_manType', 'RuleManager', 'add', 'rule', 'Rule');
  };

  this.validate = function (property, context) {
    property = ensureArgument.isMandatoryType(property, PropertyInfo,
        'm_manType', 'RuleManager', 'validate', 'property');
    context = ensureArgument.isMandatoryType(context, ValidationContext,
        'm_manType', 'RuleManager', 'validate', 'context');

    context.brokenRules.clear(property);

    var rules = validationRules[property.name];
    if (rules) {
      for (var i = 0; i < rules.length; i++) {
        var rule = rules[i];

        var result = rule.execute(rule.getInputValues(context.getProperty));

        if (result) {
          if (result.severity !== RuleSeverity.success) {
            context.brokenRules.add(result.toBrokenRule());
          }
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

    var rules = authorizationRules[context.ruleId];
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

  var args = Array.prototype.slice.call(arguments);
  args.forEach(function (arg) {
    self.add(arg);
  });

  // Immutable object.
  Object.freeze(this);
};

module.exports = RuleManager;
