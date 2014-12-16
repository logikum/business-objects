'use strict';

var ensureArgument = require('./ensure-argument.js');
var DataType = require('../data-types/data-type.js');
var PropertyFlag = require('../shared/property-flag.js');

function PropertyInfo(name, type, flags) {

  this.name = ensureArgument.isMandatoryString(name,
      'The name argument of PropertyInfo constructor must be a non-empty string.');

  type = type || {};
  if (!(type instanceof DataType || typeof type === 'function'))
    throw new Error('The type argument of PropertyInfo constructor must be a DataType object or a model type.');
  this.type = type;

  flags = ensureArgument.isOptionalInteger(flags || 0,
    'The flags argument of PropertyInfo constructor must be an integer value.');

  this.isReadOnly = (flags & PropertyFlag.readOnly) !== 0;
  this.isKey = (flags & PropertyFlag.key) !== 0;
  this.isParentKey = (flags & PropertyFlag.parentKey) !== 0;
  this.isOnDto = (flags & PropertyFlag.notOnDto) === 0;
  this.isOnCto = (flags & PropertyFlag.notOnCto) === 0;

  // Immutable object.
  Object.freeze(this);
}

module.exports = PropertyInfo;
