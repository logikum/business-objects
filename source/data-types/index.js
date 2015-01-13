/**
 * Data types' index module.
 * @module data-types/index
 */
'use strict';

var Boolean = require('./boolean.js');
var Text = require('./text.js');
var Integer = require('./integer.js');
var Decimal = require('./decimal.js');
var DateTime = require('./date-time.js');

/**
 * List of data types.
 *
 * @namespace bo/data-types
 */
var index = {
  /**
   * Boolean data type.
   * @memberof bo/data-types
   * @see {@link module:data-types/boolean} for further information.
   */
  Boolean: new Boolean(),
  /**
   * Text data type.
   * @memberof bo/data-types
   * @see {@link module:data-types/text} for further information.
   */
  Text: new Text(),
  /**
   * Integer data type.
   * @memberof bo/data-types
   * @see {@link module:data-types/integer} for further information.
   */
  Integer: new Integer(),
  /**
   * Decimal data type.
   * @memberof bo/data-types
   * @see {@link module:data-types/decimal} for further information.
   */
  Decimal: new Decimal(),
  /**
   * Date-time data type.
   * @memberof bo/data-types
   * @see {@link module:data-types/date-time} for further information.
   */
  DateTime: new DateTime()
};

// Immutable object.
Object.freeze(index);

module.exports = index;
