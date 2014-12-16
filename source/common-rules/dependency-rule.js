'use strict';

var util = require('util');
var ensureArgument = require('../shared/ensure-argument.js');
var ValidationRule = require('../rules/validation-rule.js');
var RuleSeverity = require('../rules/rule-severity.js');
var PropertyInfo = require('../shared/property-info.js');

function DependencyRule(primaryProperty, dependencies, message, priority, stopsProcessing) {
  DependencyRule.super_.call(this, 'Dependency');

  var self = this;

  // Initialize base properties.
  this.initialize(
      primaryProperty,
      message || '--- dependency rule ---',
      priority || -100,
      stopsProcessing
  );

  var err = 'The dependencies argument of DependencyRule constructor must be a single or an array of PropertyInfo objects.';
  if (dependencies instanceof PropertyInfo) {
    dependencies = [ dependencies ];
  } else if (dependencies instanceof Array) {
    if (dependencies.every(function(item) {
        return typeof item instanceof PropertyInfo;
      }))
      throw new Error(err);
  } else
    throw new Error(err);

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
