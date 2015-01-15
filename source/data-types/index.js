'use strict';

var DataType = require('./data-type.js');
var DataTypeError = require('./data-type-error.js');
var Boolean = require('./boolean.js');
var Text = require('./text.js');
var Integer = require('./integer.js');
var Decimal = require('./decimal.js');
var DateTime = require('./date-time.js');

/**
 * Contains data type components and definitions.
 *
 * @namespace bo.dataTypes
 *
 * @property {function} DataType - {@link bo.dataTypes.DataType Data type} constructor to create new definitions.
 * @property {function} DataTypeError - {@link bo.dataTypes.DataTypeError Data type error} constructor to create new errors occurred in data type definitions.
 * @property {object} Boolean - Data type instance that defines {@link bo.dataTypes.Boolean Boolean} data.
 * @property {object} Text - Data type instance that defines {@link bo.dataTypes.Text Text} data.
 * @property {object} Integer - Data type instance that defines {@link bo.dataTypes.Integer Integer} data.
 * @property {object} Decimal - Data type instance that defines {@link bo.dataTypes.Decimal Decimal} data.
 * @property {object} DateTime - Data type instance that defines {@link bo.dataTypes.DateTime DateTime} data.
 */
var index = {
  DataType: DataType,
  DataTypeError: DataTypeError,
  Boolean: new Boolean(),
  Text: new Text(),
  Integer: new Integer(),
  Decimal: new Decimal(),
  DateTime: new DateTime()
};

// Immutable object.
Object.freeze(index);

module.exports = index;
