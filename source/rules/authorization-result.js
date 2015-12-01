'use strict';

var CLASS_NAME = 'AuthorizationResult';

var util = require('util');
var Argument = require('../system/argument-check.js');
var ResultBase = require('./result-base.js');

/**
 * @classdesc Represents the failed result of executing an authorization rule.
 * @description Creates a new authorization rule result object.
 *
 * @memberof bo.rules
 * @constructor
 * @param {string} ruleName - The name of the rule.
 * @param {string} [targetName] - An eventual parameter of the authorization action.
 * @param {string} message - Human-readable description of the reason of the failure.
 *
 * @extends bo.rules.ResultBase
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The rule name must be a non-empty string.
 * @throws {@link bo.system.ArgumentError Argument error}: The target name must be a string.
 * @throws {@link bo.system.ArgumentError Argument error}: The message must be a non-empty string.
 */
function AuthorizationResult (ruleName, targetName, message) {

  targetName = Argument.inConstructor(CLASS_NAME).check(targetName || '').for('targetName').asString();

  ResultBase.call(this, ruleName, targetName, message);
}
util.inherits(AuthorizationResult, ResultBase);

module.exports = AuthorizationResult;
