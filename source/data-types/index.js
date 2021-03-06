'use strict';

//region Imports

const DataType = require( './data-type.js' );
const Boolean = require( './boolean.js' );
const Text = require( './text.js' );
const Email = require( './email.js' );
const Integer = require( './integer.js' );
const Decimal = require( './decimal.js' );
const Enum = require( './enum.js' );
const DateTime = require( './date-time.js' );

//endregion

/**
 * Contains data type components and definitions.
 *
 * @namespace bo.dataTypes
 *
 * @property {function} DataType - {@link bo.dataTypes.DataType Data type} constructor to create new definitions.
 * @property {object} Boolean - Data type instance that defines {@link bo.dataTypes.Boolean Boolean} data.
 * @property {object} Text - Data type instance that defines {@link bo.dataTypes.Text Text} data.
 * @property {object} Email - Data type instance that defines {@link bo.dataTypes.Email Email} data.
 * @property {object} Integer - Data type instance that defines {@link bo.dataTypes.Integer Integer} data.
 * @property {object} Decimal - Data type instance that defines {@link bo.dataTypes.Decimal Decimal} data.
 * @property {function} Enum - {@link bo.dataTypes.Enum Enum} constructor to create new enumeration data type.
 * @property {object} DateTime - Data type instance that defines {@link bo.dataTypes.DateTime DateTime} data.
 */
const index = {
  DataType: DataType,
  Boolean: new Boolean(),
  Text: new Text(),
  Email: new Email(),
  Integer: new Integer(),
  Decimal: new Decimal(),
  Enum: Enum,
  DateTime: new DateTime()
};

// Immutable object.
Object.freeze( index );

module.exports = index;
