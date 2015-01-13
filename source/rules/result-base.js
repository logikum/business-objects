/**
 * Base result module.
 * @module rules/result-base
 */
'use strict';

var BrokenRule = require('./broken-rule.js');
var RuleSeverity = require('./rule-severity.js');

var ResultBase = function () {

  this.ruleName = null;
  this.propertyName = null;
  this.message = null;
  this.severity = RuleSeverity.error;
  this.stopsProcessing = false;
  this.isPreserved = false;
};

ResultBase.prototype.toBrokenRule = function() {
  return new BrokenRule(this.ruleName, this.isPreserved, this.propertyName, this.message, this.severity);
};

module.exports = ResultBase;
