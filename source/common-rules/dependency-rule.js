'use strict';

var util = require('util');
var t = require('../locales/i18n-bo.js')('Rules');
var ensureArgument = require('../shared/ensure-argument.js');
var ValidationRule = require('../rules/validation-rule.js');
var RuleSeverity = require('../rules/rule-severity.js');
var PropertyInfo = require('../shared/property-info.js');

function DependencyRule(primaryProperty, dependencies, message, priority, stopsProcessing) {
  DependencyRule.super_.call(this, 'Dependency');

  var self = this;

  dependencies = ensureArgument.isMandatoryArray(dependencies, PropertyInfo,
    'c_manArray', 'DependencyRule', 'dependencies');

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

DependencyRule.prototype.execute = function (inputs) {

  var value = inputs[this.primaryProperty.name];

  if (this.primaryProperty.type.hasValue(value))
    return this.result(this.message, RuleSeverity.success);
};

module.exports = DependencyRule;
