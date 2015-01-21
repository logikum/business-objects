/**
 * Asynchronous read-only child collection module.
 * @module read-only-child-collection
 */
'use strict';

var util = require('util');
var CollectionBase = require('./collection-base.js');
var ensureArgument = require('./shared/ensure-argument.js');
var ModelError = require('./shared/model-error.js');

var ReadOnlyChildCollectionFactory = function(name, itemType) {

  name = ensureArgument.isMandatoryString(name,
      'c_manString', 'ReadOnlyChildCollection', 'name');

  // Verify the model type of the item type.
  if (itemType.modelType !== 'ReadOnlyChildModel')
    throw new ModelError('invalidItem', itemType.prototype.name, itemType.modelType,
        'ReadOnlyChildCollection', 'ReadOnlyChildModel');

  var ReadOnlyChildCollection = function (parent) {

    // Verify the model type of the parent model.
    parent = ensureArgument.isModelType(parent, ['ReadOnlyRootModel', 'ReadOnlyChildModel'],
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
