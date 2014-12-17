'use strict';

var ensureArgument = require('./ensure-argument.js');

function TransferContext(properties, getValue, setValue) {

  this.properties = ensureArgument.isMandatoryType(properties, Array,
    'The properties argument of TransferContext constructor must be an array of PropertyInfo objects.');
  this.getValue = ensureArgument.isMandatoryFunction(getValue,
    'The getValue argument of TransferContext constructor must be a function.');
  this.setValue = ensureArgument.isMandatoryFunction(setValue,
    'The setValue argument of TransferContext constructor must be a function.');

  // Immutable object.
  Object.freeze(this);
}

module.exports = TransferContext;
