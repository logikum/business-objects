'use strict';

var util = require('util');
var ensureArgument = require('../shared/ensure-argument.js');
var ResultBase = require('./result-base.js');

function AuthorizationResult(ruleName, targetName, message) {
  AuthorizationResult.super_.call(this);

  this.ruleName = ensureArgument.isMandatoryString(ruleName,
      'c_manString', 'AuthorizationResult', 'ruleName');
  this.propertyName = ensureArgument.isString(targetName || '',
      'c_string', 'AuthorizationResult', 'targetName');
  this.message = ensureArgument.isMandatoryString(message,
      'c_manString', 'AuthorizationResult', 'message');
}
util.inherits(AuthorizationResult, ResultBase);

module.exports = AuthorizationResult;
