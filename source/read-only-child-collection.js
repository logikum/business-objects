'use strict';

var util = require('util');
var CollectionBase = require('./collection-base.js');
var ModelBase = require('./model-base.js');
var ensureArgument = require('./shared/ensure-argument.js');

var ReadOnlyChildCollectionCreator = function(name, itemType) {

  name = ensureArgument.isMandatoryString(name,
      'c_manString', 'ReadOnlyChildCollectionCreator', 'name');
  itemType = ensureArgument.isMandatoryType(itemType, ModelBase,
      'c_itemType', 'ReadOnlyChildCollectionCreator', 'ReadOnlyChildModel');

  var ReadOnlyChildCollection = function (parent) {

    parent = ensureArgument.isMandatoryType(parent, ModelBase, 'c_parent', name, 'ReadOnlyModel');

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

  return ReadOnlyChildCollection;
};

module.exports = ReadOnlyChildCollectionCreator;
