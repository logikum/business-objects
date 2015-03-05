'use strict';

var CLASS_NAME = 'BrokenRulesResponse';

var t = require('../locales/i18n-bo.js')('Rules');
var EnsureArgument = require('../system/ensure-argument.js');
var BrokenRulesOutput = require('./broken-rules-output.js');

/**
 * @classdesc
 *      Represents the HTTP Response format of broken rules. The data property
 *      holds the information of broken rules. Its properties are arrays, one for
 *      each model property that has broken rule. The array elements are objects
 *      with a message and a severity property, representing the broken rules.
 * @description
 *      Creates a new broken rules response instance.
 *
 * @memberof bo.rules
 * @param {bo.rules.BrokenRulesOutput} brokenRules - The broken rules to send to the client.
 * @param {string} [message] - Human-readable description of the reason of the failure.
 * @constructor
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The broken rules must be a BrokenRulesOutput object.
 * @throws {@link bo.system.ArgumentError Argument error}: The message must be a string value.
 */
function BrokenRulesResponse (brokenRules, message) {

  brokenRules = EnsureArgument.isMandatoryType(brokenRules, BrokenRulesOutput,
      'c_manType', CLASS_NAME, 'brokenRules');

  /**
   * The name of the response object.
   * @type {string}
   * @default
   */
  this.name = 'BrokenRules';
  /**
   * The status code of the HTTP response.
   * @type {number}
   * @default
   */
  this.status = 422;
  /**
   * Human-readable description of the reason of the failure.
   * @type {string}
   */
  this.message = EnsureArgument.isString(message || t('invalid'),
      'c_string', CLASS_NAME, 'message');
  /**
   * The object of the broken rules.
   * @type {object}
   */
  this.data = brokenRules;
  /**
   * The count of the broken rules.
   * @type {number}
   * @default
   */
  this.count = brokenRules.$count;

  // Immutable object.
  Object.freeze(this);
}

module.exports = BrokenRulesResponse;
