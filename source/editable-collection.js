'use strict';

var util = require('util');
var CollectionBase = require('./collection-base.js');
var ensureArgument = require('./shared/ensure-argument.js');

var MODEL_STATE = require('./shared/model-state.js');

var EditableCollectionCreator = function(name, itemType) {

  name = ensureArgument.isMandatoryString(name,
    'The name argument of EditableCollectionCreator must be a non-empty string.');
  itemType = ensureArgument.isMandatoryFunction(itemType,
    'The itemType argument of EditableCollectionCreator must be an EditableModel type.');

  var EditableCollection = function (parent) {

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

    //region Actions

    this.create = function (callback) {
      itemType.create(parent, function (err, item) {
        if (err)
          callback(err);
        items.push(item);
        callback(null, item);
      });
    };

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

    this.remove = function () {
      items.forEach(function (item) {
        item.remove();
      });
    };

    this.save = function (callback) {
      var count = 0;
      var error = null;
      if (items.length) {
        items.forEach(function (item) {
          item.save(function (err) {
            error = error || err;
            // Check if all items are done.
            if (++count === items.length) {
              items = items.filter(function (item) {
                return item.getModelState() !== MODEL_STATE.getName(MODEL_STATE.removed);
              });
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
  util.inherits(EditableCollection, CollectionBase);

  return EditableCollection;
};

module.exports = EditableCollectionCreator;
