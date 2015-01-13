/**
 * Base data type module.
 * @module data-types/data-type
 */
'use strict';

var ensureArgument = require('../shared/ensure-argument.js');
var NotImplementedError = require('../shared/not-implemented-error.js');

function DataType (name) {

  this.name = ensureArgument.isMandatoryString(name, 'c_manString', 'DataType', 'name');

  // Immutable object.
  Object.freeze(this);
}

DataType.prototype.check = function () {
  throw new NotImplementedError('method', 'DataType', 'check');
};

DataType.prototype.hasValue = function () {
  throw new NotImplementedError('method', 'DataType', 'hasValue');
};

module.exports = DataType;
