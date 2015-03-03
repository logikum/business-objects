'use strict';

var util = require('util');
var t = require('../locales/i18n-bo.js')('Rules');
var ValidationRule = require('./validation-rule.js');

/**
 * @classdesc The rule ensures that the property value is valid.
 * @description Creates a new data type rule object.
 *
 * @memberof bo.rules
 * @constructor
 * @param {bo.shared.PropertyInfo} primaryProperty - The property definition the rule relates to.
 *
 * @extends bo.rules.ValidationRule
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The primary property must be a PropertyInfo object.
 */
function DataTypeRule (primaryProperty) {
  ValidationRule.call(this, 'DataType');

  // Initialize base properties.
  this.initialize(
      primaryProperty,
      t('dataType', primaryProperty.name, primaryProperty.type.name),
      Number.MAX_VALUE,
      true
  );

  // Immutable object.
  Object.freeze(this);
}
util.inherits(DataTypeRule, ValidationRule);

/**
 * Checks the validity of the property value.
 *
 * @abstract
 * @function bo.rules.DataTypeRule#execute
 * @param {Array.<*>} inputs - An array of the values of the required properties.
 * @returns {(bo.rules.ValidationResult|undefined)} Information about the failure.
 */
DataTypeRule.prototype.execute = function (inputs) {

  if (inputs[this.primaryProperty.name] === undefined)
    return this.result(this.message);
};

module.exports = DataTypeRule;
