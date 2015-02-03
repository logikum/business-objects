'use strict';

//region Imports

var util = require('util');
var EnsureArgument = require('./shared/ensure-argument.js');

var CollectionBase = require('./collection-base.js');
var ModelError = require('./shared/model-error.js');

//endregion

/**
 * Factory method to create definitions of synchronous read-only child collections.
 *
 * @function bo.ReadOnlyChildCollectionSync
 * @param {string} name - The name of the collection.
 * @param {ReadOnlyChildModelSync} itemType - The model type of the collection items.
 * @returns {ReadOnlyChildCollectionSync} The constructor of a asynchronous read-only child collection.
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The collection name must be a non-empty string.
 * @throws {@link bo.shared.ModelError Model error}: The item type must be an ReadOnlyChildModelSync.
 */
var ReadOnlyChildCollectionSyncFactory = function(name, itemType) {

  name = EnsureArgument.isMandatoryString(name,
      'c_manString', 'ReadOnlyChildCollectionSync', 'name');

  // Verify the model type of the item type.
  if (itemType.modelType !== 'ReadOnlyChildModelSync')
    throw new ModelError('invalidItem', itemType.prototype.name, itemType.modelType,
        'ReadOnlyChildCollectionSync', 'ReadOnlyChildModelSync');

  /**
   * @classdesc Represents the definition of a synchronous read-only child collection.
   * @description Creates a new synchronous read-only child collection instance.
   *
   * @name ReadOnlyChildCollectionSync
   * @constructor
   *
   * @extends CollectionBase
   */
  var ReadOnlyChildCollectionSync = function (parent) {
    CollectionBase.call(this);

    // Verify the model type of the parent model.
    parent = EnsureArgument.isModelType(parent, ['ReadOnlyRootModelSync', 'ReadOnlyChildModelSync'],
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
