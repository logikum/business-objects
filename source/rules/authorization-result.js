'use strict';

var util = require('util');
var ensureArgument = require('../shared/ensure-argument.js');
var ResultBase = require('./result-base.js');

function AuthorizationResult(ruleName, targetName, message) {
  AuthorizationResult.super_.call(this);

  this.ruleName = ensureArgument.isMandatoryString(ruleName,
    'The ruleName argument of AuthorizationResult constructor must be a non-empty string.');
  this.propertyName = ensureArgument.isString(targetName || '',
    'The targetName argument of AuthorizationResult constructor must be a string.');
  this.message = ensureArgument.isMandatoryString(message,
    'The message argument of AuthorizationResult constructor must be a non-empty string.');
}
util.inherits(AuthorizationResult, ResultBase);

module.exports = AuthorizationResult;
