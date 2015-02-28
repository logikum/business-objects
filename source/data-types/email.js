'use strict';

var util = require('util');
var DataType = require('./data-type.js');
var DataTypeError = require('./data-type-error.js');

var reEmail = /^(([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+)?$/;

/**
 * @classdesc Provide methods to work with Email data.
 * @description Creates Email data type definition.
 *
 * @memberof bo.dataTypes
 * @constructor
 *
 * @extends bo.dataTypes.DataType
 */
function Email () {
  // Immutable object.
  DataType.call(this);
}
util.inherits(Email, DataType);

/**
 * Checks if value is an Email data.
 *
 * @function bo.dataTypes.Email#check
 * @param {*} [value] - The value to check.
 *
 * @throws {@link bo.dataTypes.DataTypeError Data type error}: The passed value is not Email.
 */
Email.prototype.check = function (value) {

  if (!(value === null || (typeof value === 'string' || (value instanceof String))
      && value.length && reEmail.test(value)))
    throw new DataTypeError('email');
};

/**
 * Checks if value is an Email data and is not null.
 *
 * @function bo.dataTypes.Email#hasValue
 * @param {data} value - The value to check.
 * @returns {boolean} True if the value is Email and not null, otherwise false.
 *
 * @throws {@link bo.dataTypes.DataTypeError Data type error}: The passed value is not Email.
 */
Email.prototype.hasValue = function (value) {

  this.check(value);
  return value != undefined && value != null;
};

module.exports = Email;
