'use strict';

var ensureArgument = require('./ensure-argument.js');
var UserInfo = require('./user-info.js');

function DataContext(dao, user, isSelfDirty, toDto, fromDto) {

  this.dao = ensureArgument.isMandatoryObject(dao,
    'The dao argument of DataContext constructor must be an object.');
  this.user = ensureArgument.isOptionalType(user, UserInfo,
    'The user argument of DataContext constructor must be an UserInfo object or null.');
  this.isSelfDirty = ensureArgument.isMandatoryBoolean(isSelfDirty,
    'The isSelfDirty argument of DataContext constructor must be a Boolean value.');
  this.toDto = ensureArgument.isMandatoryFunction(toDto,
    'The toDto argument of DataContext constructor must be a function.');
  this.fromDto = ensureArgument.isMandatoryFunction(fromDto,
    'The fromDto argument of DataContext constructor must be a function.');

  // Immutable object.
  Object.freeze(this);
}

module.exports = DataContext;
