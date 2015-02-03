'use strict';

var EnsureArgument = require('../shared/ensure-argument.js');
var ArgumentError = require('../system/argument-error.js');
var RuleList = require('./rule-list.js');
var ValidationRule = require('./validation-rule.js');
var ValidationContext = require('./validation-context.js');
var AuthorizationRule = require('./authorization-rule.js');
var AuthorizationContext = require('./authorization-context.js');
var RuleSeverity = require('./rule-severity.js');
var NoAccessBehavior = require('./no-access-behavior.js');
var PropertyInfo = require('../shared/property-info.js');

/**
 * @classdesc Provides methods to manage the rules of a business object model.
 * @description Creates a new rule manager object.
 *
 * @memberof bo.rules
 * @constructor
 */
var RuleManager = function () {

  var self = this;
  var validationRules = new RuleList();
  var authorizationRules = new RuleList();
  var noAccessBehavior = null;

  /**
   * Defines the default behavior for unauthorized operations.
   * @name {bo.rules.RuleManager#noAccessBehavior}
   * @type {bo.rules.NoAccessBehavior}
   * @default {bo.rules.NoAccessBehavior#throwError}
   */
  Object.defineProperty(this, 'noAccessBehavior', {
    get: function () {
      return noAccessBehavior;
    },
    set: function (value) {
      noAccessBehavior = EnsureArgument.isEnumMember(value, NoAccessBehavior, NoAccessBehavior.throwError,
          'p_enumType', 'RuleManager', 'noAccessBehavior');
    },
    enumeration: true
  });

  /**
   * Initializes the rule manager: sorts the rules by priority and
   * sets the default behavior for unauthorized operations.
   *
   * @param {bo.rules.NoAccessBehavior} defaultBehavior - The default behavior for unauthorized operations.
   *
   * @throws {@link bo.system.ArgumentError Argument error}: The severity must be a NoAccessBehavior item.
   */
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

  /**
   * Adds a new rule to the business object model.
   *
   * @param {(bo.rules.ValidationRule|bo.rules.AuthorizationRule)} rule - The rule to add.
   *
   * @throws {@link bo.system.ArgumentError Argument error}: The rule must be a Rule object.
   * @throws {@link bo.system.ArgumentError Argument error}: The rule is not initialized.
   */
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

  /**
   * Validates a property - executes all validation rules of the property.
   *
   * @param {bo.shared.PropertyInfo} property - The model property to validate.
   * @param {bo.rules.ValidationContext} context - The context of the property validation.
   *
   * @throws {@link bo.system.ArgumentError Argument error}: The property must be a PropertyInfo object.
   * @throws {@link bo.system.ArgumentError Argument error}: The context must be a ValidationContext object.
   */
  this.validate = function (property, context) {
    property = EnsureArgument.isMandatoryType(property, PropertyInfo,
        'm_manType', 'RuleManager', 'validate', 'property');
    context = EnsureArgument.isMandatoryType(context, ValidationContext,
        'm_manType', 'RuleManager', 'validate', 'context');

    context.brokenRules.clear(property);

    var rules = validationRules[property.name];
    if (rules) {
      for (var i = 0; i < rules.length; i++) {
        var rule = rules[i];

        var result = rule.execute(rule.getInputValues(context.getValue));

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

  /**
   * Validates a property - executes all validation rules of the property.
   *
   * @param {bo.rules.AuthorizationContext} context - The context of the action authorization.
   *
   * @throws {@link bo.system.ArgumentError Argument error}: The context must be a AuthorizationContext object.
   * @throws {@link bo.rules.AuthorizationError Authorization error}: The user has no permission to execute the action.
   */
  this.hasPermission = function (context) {
    context = EnsureArgument.isMandatoryType(context, AuthorizationContext,
        'm_manType', 'RuleManager', 'hasPermission', 'context');
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
