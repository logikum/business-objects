'use strict';

var DataType = require('./data-type.js');
var DataTypeError = require('./data-type-error.js');
var Boolean = require('./boolean.js');
var Text = require('./text.js');
var Integer = require('./integer.js');
var Decimal = require('./decimal.js');
var DateTime = require('./date-time.js');

/**
 * List of data types.
 * @namespace bo.dataTypes
 */
var index = {
  /**
   * Base data type class used to create data type definitions.
   * @memberof bo.dataTypes
   * @instance
   * @see {@link bo.dataTypes.DataType DataType} for further information.
   */
  DataType: DataType,
  /**
   * Represents an error occurred in a data type definition.
   * @memberof bo.dataTypes
   * @instance
   * @see {@link bo.dataTypes.DataTypeError DataTypeError} for further information.
   */
  DataTypeError: DataTypeError,
  /**
   * Data type definition for Boolean data.
   * @memberof bo.dataTypes
   * @inner
   * @see {@link bo.dataTypes.Boolean Boolean} for further information.
   */
  Boolean: new Boolean(),
  /**
   * Data type definition for Text data.
   * @memberof bo.dataTypes
   * @inner
   * @see {@link bo.dataTypes.Text Text} for further information.
   */
  Text: new Text(),
  /**
   * Data type definition for Integer data.
   * @memberof bo.dataTypes
   * @inner
   * @see {@link bo.dataTypes.Integer Integer} for further information.
   */
  Integer: new Integer(),
  /**
   * Data type definition for Decimal data.
   * @memberof bo.dataTypes
   * @inner
   * @see {@link bo.dataTypes.Decimal Decimal} for further information.
   */
  Decimal: new Decimal(),
  /**
   * Data type definition for DateTime data.
   * @memberof bo.dataTypes
   * @inner
   * @see {@link bo.dataTypes.DateTime DateTime} for further information.
   */
  DateTime: new DateTime()
};

// Immutable object.
Object.freeze(index);

module.exports = index;
