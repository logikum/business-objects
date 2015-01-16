'use strict';

/**
 * @classdesc Represents the eligible attributes of
 *    a {@link bo.shared.PropertyInfo property definition}.
 * @description
 *    Creates a new object containing the property flag set.
 *
 * @memberof bo.shared
 * @constructor
 *
 * @extends bo.shared.Enumeration
 */
function PropertyFlag() {

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
   * @constant
   * @default
   * @readonly
   */
  this.notOnDto = 8;
  /**
   * The value of the model property will not be used on the client transfer object.
   * @constant
   * @default
   * @readonly
   */
  this.notOnCto = 16;

  // Immutable object.
  Object.freeze(this);
}

module.exports = new PropertyFlag();
