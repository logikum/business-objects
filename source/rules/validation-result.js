'use strict';

var util = require('util');
var ensureArgument = require('../shared/ensure-argument.js');
var ResultBase = require('./result-base.js');

function ValidationResult(ruleName, propertyName, message) {
  ValidationResult.super_.call(this);

  this.ruleName = ensureArgument.isMandatoryString(ruleName,
    'The ruleName argument of ValidationResult constructor must be a non-empty string.');
  this.propertyName = ensureArgument.isMandatoryString(propertyName,
    'The propertyName argument of ValidationResult constructor must be a string.');
  this.message = ensureArgument.isMandatoryString(message,
    'The message argument of ValidationResult constructor must be a non-empty string.');
  this.affectedProperties = null;
}
util.inherits(ValidationResult, ResultBase);

module.exports = ValidationResult;
