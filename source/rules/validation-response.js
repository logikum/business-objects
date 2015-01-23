'use strict';

var t = require('../locales/i18n-bo.js')('Rules');
var ensureArgument = require('../shared/ensure-argument.js');
var BrokenRulesOutput = require('./broken-rules-output.js');
var RuleSeverity = require('./rule-severity.js');

/**
 * @classdesc
 *      Represents the HTTP Response format of broken rules. The data property
 *      holds the information of broken rules. Its properties are arrays, one for
 *      each model property that has broken rule. The array elements are objects
 *      with a message and a severity property, representing the broken rules.
 * @description
 *      Creates a new validation response instance.
 *
 * @memberof bo.rules
 * @param {bo.rules.BrokenRulesOutput} brokenRules - The broken rules to send to the client.
 * @param {string} [message] - Human-readable description of the reason of the failure.
 * @constructor
 *
 * @throws {@link bo.shared.ArgumentError Argument error}: The message must be a string value.
 */
function ValidationResponse(brokenRules, message) {

  brokenRules = ensureArgument.isMandatoryType(brokenRules, BrokenRulesOutput,
      'c_manType', 'ValidationResponse', 'brokenRules');

  /**
   * The name of the response object.
   * @type {string}
   * @default
   */
  this.name = 'ValidationError';
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
  this.message = ensureArgument.isString(message || t('invalid'),
      'c_string', 'ValidationResponse', 'message');
  /**
   * The object of the broken rules.
   * @type {object}
   */
  this.data = {};
  /**
   * The count of the broken rules.
   * @type {number}
   * @default
   */
  this.count = 0;

  for (var property in brokenRules) {
    if (brokenRules.hasOwnProperty(property) && brokenRules[property] instanceof Array) {
      var errors = brokenRules[property].filter(function (brokenRule) {
        return brokenRule.severity === RuleSeverity.error;
      });
      if (errors.length) {
        this.data[property] = errors;
        this.count += errors.length;
      }
    }
  }

  // Immutable object.
  Object.freeze(this);
}

module.exports = ValidationResponse;
