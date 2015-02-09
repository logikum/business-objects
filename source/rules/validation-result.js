'use strict';

var CLASS_NAME = 'ValidationResult';

var util = require('util');
var EnsureArgument = require('../system/ensure-argument.js');
var ResultBase = require('./result-base.js');

/**
 * @classdesc Represents the failed result of executing a validation rule.
 * @description Creates a new validation rule result object.
 *
 * @memberof bo.rules
 * @constructor
 * @param {string} ruleName - The name of the rule.
 * @param {string} propertyName - The name of the property the rule belongs to.
 * @param {string} message - Human-readable description of the reason of the failure.
 *
 * @extends bo.rules.ResultBase
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The rule name must be a non-empty string.
 * @throws {@link bo.system.ArgumentError Argument error}: The property name must be a non-empty string.
 * @throws {@link bo.system.ArgumentError Argument error}: The message must be a non-empty string.
 */
function ValidationResult (ruleName, propertyName, message) {

  propertyName = EnsureArgument.isMandatoryString(propertyName,
      'c_manString', CLASS_NAME, 'propertyName');

  ResultBase.call(this, ruleName, propertyName, message);

  /**
   * An array of properties that are affected by the rule.
   * @type {Array.<bo.shared.PropertyInfo>}
   * @readonly
   */
  this.affectedProperties = null;
}
util.inherits(ValidationResult, ResultBase);

module.exports = ValidationResult;
