'use strict';

var ensureArgument = require('./ensure-argument.js');
var DataType = require('../data-types/data-type.js');

function PropertyInfo(name, type, writable) {

  type = type || {};
  if (!(type instanceof DataType || typeof type === 'function'))
    throw new Error('The type argument of PropertyInfo constructor must be a DataType object or a model type.');

  this.name = ensureArgument.isMandatoryString(name,
      'The name argument of PropertyInfo constructor must be a non-empty string.');
  this.type = type;
  this.readOnly = ensureArgument.isMandatoryBoolean(!(writable || true),
      'The writable argument of PropertyInfo constructor must be a Boolean value.');

  // Immutable object.
  Object.freeze(this);
}

module.exports = PropertyInfo;
