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

  flags = type instanceof DataType ?
    ensureArgument.isOptionalInteger(flags || PropertyFlag.none,
        'The flags argument of PropertyInfo constructor must be an integer value.') :
    PropertyFlag.readOnly | PropertyFlag.notOnDto | PropertyFlag.notOnCto;

  this.isReadOnly = (flags & PropertyFlag.readOnly) === PropertyFlag.readOnly;
  this.isKey = (flags & PropertyFlag.key) === PropertyFlag.key;
  this.isParentKey = (flags & PropertyFlag.parentKey) === PropertyFlag.parentKey;
  this.isOnDto = (flags & PropertyFlag.notOnDto) === PropertyFlag.none;
  this.isOnCto = (flags & PropertyFlag.notOnCto) === PropertyFlag.none;

  // Immutable object.
  Object.freeze(this);
}

module.exports = PropertyInfo;
