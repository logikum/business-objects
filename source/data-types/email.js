'use strict';

var util = require('util');
var DataType = require('./data-type.js');

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
 * @function bo.dataTypes.Email#parse
 * @param {*} [value] - The value to check.
 * @returns {*} The Email value or null when the input value is valid, otherwise undefined.
 */
Email.prototype.parse = function (value) {

  if (value === null)
    return value;
  if (value === undefined)
    return null;

  var email;
  if (typeof value === 'string')
    email = value;
  else if (value instanceof String)
    email = value.valueOf();
  else
    email = new String(value).valueOf();

  return email.length && reEmail.test(email) ? email : undefined;
};

/**
 * Checks if value is an Email data and is not null.
 *
 * @function bo.dataTypes.Email#hasValue
 * @param {data} value - The value to check.
 * @returns {boolean} True if the value is Email and not null, otherwise false.
 */
Email.prototype.hasValue = function (value) {

  var parsed = this.parse(value);
  return parsed !== undefined && parsed !== null;
};

module.exports = Email;
