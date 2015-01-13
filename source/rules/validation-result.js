/**
 * Validation result module.
 * @module rules/validation-result
 */
'use strict';

var util = require('util');
var ensureArgument = require('../shared/ensure-argument.js');
var ResultBase = require('./result-base.js');

function ValidationResult(ruleName, propertyName, message) {
  ValidationResult.super_.call(this);

  this.ruleName = ensureArgument.isMandatoryString(ruleName,
      'c_manString', 'ValidationResult', 'ruleName');
  this.propertyName = ensureArgument.isMandatoryString(propertyName,
      'c_manString', 'ValidationResult', 'propertyName');
  this.message = ensureArgument.isMandatoryString(message,
      'c_manString', 'ValidationResult', 'message');
  this.affectedProperties = null;
}
util.inherits(ValidationResult, ResultBase);

module.exports = ValidationResult;
