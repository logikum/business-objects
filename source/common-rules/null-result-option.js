'use strict';

var util = require('util');
var Enumeration = require('../system/enumeration.js');

/**
 * @classdesc Represents the eligible actions when
 *    an {@link bo.commonRules.ExpressionRule expression rule} is executed on a null value.
 * @description
 *    Creates a new object containing null result options.
 *
 * @memberof bo.commonRules
 * @constructor
 *
 * @extends bo.system.Enumeration
 */
function NullResultOption() {
  Enumeration.call(this);

  /**
   * The result of the rule will be success.
   * @constant
   * @default
   * @readonly
   */
  this.returnTrue = 0;
  /**
   * The result of the rule will be failure.
   * @constant
   * @default
   * @readonly
   */
  this.returnFalse = 1;
  /**
   * The value will be replaced by an empty string.
   * @constant
   * @default
   * @readonly
   */
  this.convertToEmptyString = 2;

  // Immutable object.
  Object.freeze(this);
}
util.inherits(NullResultOption, Enumeration);

module.exports = new NullResultOption();
