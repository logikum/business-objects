'use strict';

var ensureArgument = require('./ensure-argument.js');
var DataType = require('../data-types/data-type.js');
var PropertyFlag = require('../shared/property-flag.js');
var ModelBase = require('../model-base.js');
var CollectionBase = require('../collection-base.js');

function PropertyInfo(name, type, flags) {

  this.name = ensureArgument.isMandatoryString(name,
      'c_manString', 'PropertyInfo', 'name');
  this.type = ensureArgument.isMandatoryType(type, [ DataType, ModelBase, CollectionBase ],
      'c_manType', 'PropertyInfo', 'type');
  flags = type instanceof DataType ?
    ensureArgument.isMandatoryInteger(flags || PropertyFlag.none,
        'c_optInteger', 'PropertyInfo', 'flags') :
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
