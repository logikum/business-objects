/**
 * Synchronous read-only child collection module.
 * @module read-only-child-collection-sync
 */
'use strict';

var util = require('util');
var CollectionBase = require('./collection-base.js');
var ModelBase = require('./model-base.js');
var ensureArgument = require('./shared/ensure-argument.js');

var ReadOnlyChildCollectionSyncCreator = function(name, itemType) {

  name = ensureArgument.isMandatoryString(name,
      'c_manString', 'ReadOnlyChildCollectionSyncCreator', 'name');
  itemType = ensureArgument.isMandatoryType(itemType, ModelBase,
      'c_itemType', 'ReadOnlyChildCollectionSyncCreator', 'ReadOnlyChildModelSync');

  var ReadOnlyChildCollectionSync = function (parent) {

    parent = ensureArgument.isMandatoryType(parent, ModelBase, 'c_parent', name, 'ReadOnlyModelSync');

    var self = this;
    var items = [];

    this.name = name;

    Object.defineProperty(self, 'count', {
      get: function () {
        return items.length;
      },
      enumerable: false
    });

    //region Transfer object methods

    this.toCto = function () {
      var cto = [];
      items.forEach(function (item) {
        cto.push(item.toCto());
      });
      return cto;
    };

    //endregion

    //region Actions

    this.fetch = function (data) {
      if (data instanceof Array) {
        data.forEach(function (dto) {
          var item = itemType.load(parent, dto);
          items.push(item);
        });
      }
    };

    //endregion

    //region Public array methods

    this.at = function (index) {
      return items[index];
    };

    this.forEach = function (callback) {
      items.forEach(callback);
    };

    this.every = function (callback) {
      return items.every(callback);
    };

    this.some = function (callback) {
      return items.some(callback);
    };

    this.filter = function (callback) {
      return items.filter(callback);
    };

    this.map = function (callback) {
      return items.map(callback);
    };

    this.sort = function (fnCompare) {
      return items.sort(fnCompare);
    };

    //endregion

    // Immutable object.
    Object.freeze(this);
  };
  util.inherits(ReadOnlyChildCollectionSync, CollectionBase);

  return ReadOnlyChildCollectionSync;
};

module.exports = ReadOnlyChildCollectionSyncCreator;
