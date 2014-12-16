'use strict';

var util = require('util');
var ensureArgument = require('./shared/ensure-argument.js');
var CollectionBase = require('./collection-base.js');

var EditableCollectionBuilder = function(name, itemType) {

  name = ensureArgument.isMandatoryString(name,
    'The name argument of EditableCollectionBuilder constructor must be a non-empty string.');
  itemType = ensureArgument.isMandatoryFunction(itemType,
    'The itemType argument of EditableCollectionBuilder constructor must be an EditableModel type.');

  var EditableCollection = function (parent) {

    var self = this;
    var items = [];

    //region Model properties and methods

    this.name = name;

    this.create = function (callback) {
      itemType.create(parent, function (err, item) {
        if (err)
          callback(err);
        items.push(item);
        callback(null, item);
      });
    };

    this.fetch = function (data, callback) {
      if (data instanceof Array) {
        data.forEach(function (dto) {
          var item = new itemType(parent, dto);
          items.push(item);
        });
      }
      callback(null);
    };

    this.remove = function () {
      items.forEach(function (item) {
        item.remove();
      });
    };

    this.save = function (callback) {
      var count = 0;
      var error = null;
      items.forEach(function (item) {
        item.save(function (err) {
          error = error || err;
          count++;
          // Check if all items are done.
          if (count === items.length) {
            callback(error);
          }
        });
      });
    };

    this.toCto = function () {
      var cto = [];
      items.forEach(function (item) {
        cto.push(item.toCto());
      });
      return cto;
    };

    this.fromCto = function (data) {
      if (data instanceof Array) {
        data.forEach(function (cto) {
          var item = new itemType(parent);
          item.fromCto(cto);
          items.push(item);
        });
      }
    };

    //endregion

    //region Public array properties and methods

    Object.defineProperty(self, 'count', {
      get: function () {
        return items.length;
      },
      enumerable: false
    });

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
  util.inherits(EditableCollection, CollectionBase);

  return EditableCollection;
};

module.exports = EditableCollectionBuilder;
