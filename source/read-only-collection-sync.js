'use strict';

var util = require('util');
var CollectionBase = require('./collection-base.js');
var ensureArgument = require('./shared/ensure-argument.js');

var ReadOnlyCollectionSyncCreator = function(name, itemType) {

  name = ensureArgument.isMandatoryString(name,
    'The name argument of ReadOnlyCollectionSyncCreator must be a non-empty string.');
  itemType = ensureArgument.isMandatoryFunction(itemType,
    'The itemType argument of ReadOnlyCollectionSyncCreator must be an ReadOnlyModelSync type.');

  var ReadOnlyCollectionSync = function (parent) {

    var self = this;
    var items = [];

    this.name = name;

    Object.defineProperty(self, 'count', {
      get: function () {
        return items.length;
      },
      enumerable: false
    });

    //region Model methods

    this.fetch = function (data) {
      if (data instanceof Array) {
        data.forEach(function (dto) {
          var item = itemType.load(parent, dto);
          items.push(item);
        });
      }
    };

    this.toCto = function () {
      var cto = [];
      items.forEach(function (item) {
        cto.push(item.toCto());
      });
      return cto;
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
  util.inherits(ReadOnlyCollectionSync, CollectionBase);

  return ReadOnlyCollectionSync;
};

module.exports = ReadOnlyCollectionSyncCreator;
