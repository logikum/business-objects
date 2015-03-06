'use strict';

var util = require('util');
var Enumeration = require('../system/enumeration.js');

/**
 * @classdesc Specifies the severity of a rule failure.
 * @description Creates a new enumeration to define rule severity options.
 *
 * @memberof bo.rules
 * @constructor
 *
 * @extends bo.system.Enumeration
 */
function RuleSeverity() {
  Enumeration.call(this);

  /**
   * The rule executed successfully.
   * @type {number}
   * @readonly
   * @default 0
   */
  this.success = 0;
  /**
   * The broken rule represents information.
   * @type {number}
   * @readonly
   * @default 1
   */
  this.information = 1;
  /**
   * The broken rule represents a warning.
   * @type {number}
   * @readonly
   * @default 2
   */
  this.warning = 2;
  /**
   * The broken rule represents an error.
   * @type {number}
   * @readonly
   * @default 3
   */
  this.error = 3;

  // Immutable object.
  Object.freeze(this);
}
util.inherits(RuleSeverity, Enumeration);

module.exports = new RuleSeverity();
