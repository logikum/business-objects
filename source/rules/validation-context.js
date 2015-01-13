/**
 * Validation context module.
 * @module rules/validation-context
 */
'use strict';

var ensureArgument = require('../shared/ensure-argument.js');
var BrokenRuleList = require('./broken-rule-list.js');

function ValidationContext(getProperty, brokenRules) {

  this.getProperty = ensureArgument.isMandatoryFunction(getProperty,
      'c_manFunction', 'ValidationContext', 'getProperty');
  this.brokenRules = ensureArgument.isMandatoryType(brokenRules, BrokenRuleList,
      'c_manType', 'ValidationContext', 'brokenRules');

  // Immutable object.
  Object.freeze(this);
}

module.exports = ValidationContext;
