'use strict';

var ensureArgument = require('../shared/ensure-argument.js');
var BrokenRuleList = require('./broken-rule-list.js');

function ValidationContext(getProperty, brokenRules) {

  this.getProperty = ensureArgument.isMandatoryFunction(getProperty,
    'The getProperty argument of ValidationContext constructor must be a function.');
  this.brokenRules = ensureArgument.isMandatoryType(brokenRules, BrokenRuleList,
    'The brokenRules argument of ValidationContext constructor must be a BrokenRuleList object.');

  // Immutable object.
  Object.freeze(this);
}

module.exports = ValidationContext;
