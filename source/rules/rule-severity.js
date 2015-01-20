'use strict';

var util = require('util');
var Enumeration = require('../shared/enumeration.js');

/**
 * @classdesc Specifies the severity of a rule failure.
 * @description Creates a new enumeration to define rule severity options.
 *
 * @memberof bo.rules
 * @constructor
 *
 * @extends bo.shared.Enumeration
 */
function RuleSeverity() {
  RuleSeverity.super_.call(this, 'RuleSeverity');

  /**
   * The rule executed successfully.
   * @type {number}
   * @readonly
   */
  this.success = 0;
  /**
   * The broken rule represents information.
   * @type {number}
   * @readonly
   */
  this.information = 1;
  /**
   * The broken rule represents a warning.
   * @type {number}
   * @readonly
   */
  this.warning = 2;
  /**
   * The broken rule represents an error.
   * @type {number}
   * @readonly
   */
  this.error = 3;

  // Immutable object.
  Object.freeze(this);
}
util.inherits(RuleSeverity, Enumeration);

module.exports = new RuleSeverity();
