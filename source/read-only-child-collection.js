'use strict';

//region Imports

var util = require('util');
var EnsureArgument = require('./shared/ensure-argument.js');

var CollectionBase = require('./collection-base.js');
var ModelError = require('./shared/model-error.js');

//endregion

/**
 * Factory method to create definitions of asynchronous read-only child collections.
 *
 * @function bo.ReadOnlyChildCollection
 * @param {string} name - The name of the collection.
 * @param {ReadOnlyChildModel} itemType - The model type of the collection items.
 * @returns {ReadOnlyChildCollection} The constructor of an asynchronous read-only child collection.
 *
 * @throws {@link bo.shared.ArgumentError Argument error}: The collection name must be a non-empty string.
 * @throws {@link bo.shared.ModelError Model error}: The item type must be an ReadOnlyChildModel.
 */
var ReadOnlyChildCollectionFactory = function(name, itemType) {

  name = EnsureArgument.isMandatoryString(name,
      'c_manString', 'ReadOnlyChildCollection', 'name');

  // Verify the model type of the item type.
  if (itemType.modelType !== 'ReadOnlyChildModel')
    throw new ModelError('invalidItem', itemType.prototype.name, itemType.modelType,
        'ReadOnlyChildCollection', 'ReadOnlyChildModel');

  /**
   * @classdesc Represents the definition of an asynchronous read-only child collection.
   * @description Creates a new asynchronous read-only child collection instance.
   *
   * @name ReadOnlyChildCollection
   * @constructor
   *
   * @extends CollectionBase
   */
  var ReadOnlyChildCollection = function (parent) {
    CollectionBase.call(this);

    // Verify the model type of the parent model.
    parent = EnsureArgument.isModelType(parent, ['ReadOnlyRootModel', 'ReadOnlyChildModel'],
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

    this.fetch = function (data, callback) {
      if (data instanceof Array && data.length) {
        var count = 0;
        var error = null;
        data.forEach(function (dto) {
          itemType.load(parent, dto, function (err, item) {
            if (err)
              error = error || err;
            else
              items.push(item);
            // Check if all items are done.
            if (++count === data.length) {
              callback(error);
            }
          });
        });
      } else
        callback(null);
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
  util.inherits(ReadOnlyChildCollection, CollectionBase);

  ReadOnlyChildCollection.modelType = 'ReadOnlyChildCollection';

  return ReadOnlyChildCollection;
};

module.exports = ReadOnlyChildCollectionFactory;
