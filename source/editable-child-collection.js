/**
 * Asynchronous editable child collection module.
 * @module editable-child-collection
 */
'use strict';

var util = require('util');
var CollectionBase = require('./collection-base.js');
var ModelBase = require('./model-base.js');
var ensureArgument = require('./shared/ensure-argument.js');

var MODEL_STATE = require('./shared/model-state.js');

var EditableChildCollectionCreator = function(name, itemType) {

  name = ensureArgument.isMandatoryString(name,
      'c_manString', 'EditableChildCollectionCreator', 'name');
  itemType = ensureArgument.isMandatoryType(itemType, ModelBase,
      'c_itemType', 'EditableChildCollectionCreator', 'EditableChildModel');

  var EditableChildCollection = function (parent) {

    parent = ensureArgument.isMandatoryType(parent, ModelBase, 'c_parent', name, 'EditableModel');

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
        var dataNew = data.filter(function () { return true; });
        var itemsLate = [];
        // Update existing items.
        items.forEach(function (item, index) {
          var dataFound = false;
          var i = 0;
          for (; i < dataNew.length; i++) {
            var cto = data[i];
            if (item.keyEquals(cto)) {
              item.fromCto(cto);
              dataFound = true;
              break;
            }
          }
          if (dataFound)
            dataNew.splice(i, 1);
          else
            itemsLate.push(index);
        });
        // Remove non existing items.
        itemsLate.forEach(function (index) {
          items[index].remove();
        });
        // Insert non existing data.
        dataNew.forEach(function (cto) {
          itemType.create(parent, function (err, item) {
            if (err)
              throw err;
            else {
              item.fromCto(cto);
              items.push(item);
            }
          });
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

    this.save = function (connection, callback) {
      var count = 0;
      var error = null;
      if (items.length) {
        items.forEach(function (item) {
          item.save(connection, function (err) {
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
  util.inherits(EditableChildCollection, CollectionBase);

  return EditableChildCollection;
};

module.exports = EditableChildCollectionCreator;
