/**
 * Synchronous read-only child collection module.
 * @module read-only-child-collection-sync
 */
'use strict';

var util = require('util');
var CollectionBase = require('./collection-base.js');
var ensureArgument = require('./shared/ensure-argument.js');
var ModelError = require('./shared/model-error.js');

var ReadOnlyChildCollectionSyncFactory = function(name, itemType) {

  name = ensureArgument.isMandatoryString(name,
      'c_manString', 'ReadOnlyChildCollectionSync', 'name');

  // Verify the model type of the item type.
  if (itemType.modelType !== 'ReadOnlyChildModelSync')
    throw new ModelError('invalidItem', itemType.prototype.name, itemType.modelType,
        'ReadOnlyChildCollectionSync', 'ReadOnlyChildModelSync');

  var ReadOnlyChildCollectionSync = function (parent) {

    // Verify the model type of the parent model.
    parent = ensureArgument.isModelType(parent, ['ReadOnlyRootModelSync', 'ReadOnlyChildModelSync'],
        'c_modelType', name);

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

  ReadOnlyChildCollectionSync.modelType = 'ReadOnlyChildCollectionSync';

  return ReadOnlyChildCollectionSync;
};

module.exports = ReadOnlyChildCollectionSyncFactory;
