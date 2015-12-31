'use strict';

var util = require('util');
var Enumeration = require('../system/enumeration.js');

/**
 * @classdesc Represents the eligible attributes of
 *    a {@link bo.shared.PropertyInfo property definition}.
 * @description
 *    Creates a new object containing the property flag set.
 *
 * @memberof bo.shared
 * @constructor
 *
 * @extends bo.system.Enumeration
 */
function PropertyFlag () {
  Enumeration.call(this);

  /**
   * None of the property flags.
   * @constant
   * @default
   * @readonly
   */
  this.none = 0;
  /**
   * The model property cannot be set.
   * @constant
   * @default
   * @readonly
   */
  this.readOnly = 1;
  /**
   * The model property is a key element of the model.
   * @constant
   * @default
   * @readonly
   */
  this.key = 2;
  /**
   * The model property is a key element of the parent model.
   * @constant
   * @default
   * @readonly
   */
  this.parentKey = 4;
  /**
   * The value of the model property will not be used on the data transfer object.
   * Equivalent with PropertyFlag.onCtoOnly.
   * @constant
   * @default
   * @readonly
   */
  this.notOnDto = 8;
  /**
   * The value of the model property will not be used on the client transfer object.
   * Equivalent with PropertyFlag.onDtoOnly.
   * @constant
   * @default
   * @readonly
   */
  this.notOnCto = 16;
  /**
   * The value of the model property will be used on the client transfer object only.
   * Equivalent with PropertyFlag.notOnDto.
   * @constant
   * @default
   * @readonly
   */
  this.onCtoOnly = 8;
  /**
   * The value of the model property will be used on the data transfer object only.
   * Equivalent with PropertyFlag.notOnCto.
   * @constant
   * @default
   * @readonly
   */
  this.onDtoOnly = 16;

  // Immutable object.
  Object.freeze(this);
}
util.inherits(PropertyFlag, Enumeration);

module.exports = new PropertyFlag();
