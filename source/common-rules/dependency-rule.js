'use strict';

var CLASS_NAME = 'DependencyRule';

var util = require('util');
var t = require('../locales/i18n-bo.js')('Rules');
var EnsureArgument = require('../system/ensure-argument.js');
var ValidationRule = require('../rules/validation-rule.js');
var RuleSeverity = require('../rules/rule-severity.js');
var PropertyInfo = require('../shared/property-info.js');

/**
 * @classdesc
 *      The rule ensures that the changes of the property value start
 *      the rule checking on the dependent properties as well.
 * @description
 *      Creates a new dependency rule object.
 *
 * @memberof bo.commonRules
 * @constructor
 * @param {bo.shared.PropertyInfo} primaryProperty - The property definition the rule relates to.
 * @param {(bo.shared.PropertyInfo|Array.<bo.shared.PropertyInfo>)} dependencies -
 *    A single dependent property or an array of them.
 * @param {string} message - Human-readable description of the rule failure.
 * @param {number} [priority=-100] - The priority of the rule.
 * @param {boolean} [stopsProcessing=false] - Indicates the rule behavior in case of failure.
 *
 * @extends bo.rules.ValidationRule
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The primary property must be a PropertyInfo object.
 * @throws {@link bo.system.ArgumentError Argument error}: The dependencies must be
 *    an array of PropertyInfo objects or a single PropertyInfo object.
 * @throws {@link bo.system.ArgumentError Argument error}: The message must be a non-empty string.
 */
function DependencyRule (primaryProperty, dependencies, message, priority, stopsProcessing) {
  ValidationRule.call(this, 'Dependency');

  var self = this;

  dependencies = EnsureArgument.isMandatoryArray(dependencies, PropertyInfo,
    'c_manArray', CLASS_NAME, 'dependencies');

  // Initialize base properties.
  this.initialize(
      primaryProperty,
      message || t('dependency'),
      priority || -100,
      stopsProcessing
  );

  dependencies.forEach(function (dependency) {
    self.addAffectedProperty(dependency);
  });

  // Immutable object.
  Object.freeze(this);
}
util.inherits(DependencyRule, ValidationRule);

/**
 * Ensures that the changes of the property value start
 * the rule checking on the dependent properties as well.
 *
 * @abstract
 * @function bo.commonRules.DependencyRule#execute
 * @param {Array.<*>} inputs - An array of the values of the required properties.
 * @returns {(bo.rules.ValidationResult|undefined)} Information about the failure.
 */
DependencyRule.prototype.execute = function (inputs) {

  var value = inputs[this.primaryProperty.name];

  if (this.primaryProperty.hasValue(value))
    return this.result(this.message, RuleSeverity.success);
};

module.exports = DependencyRule;
