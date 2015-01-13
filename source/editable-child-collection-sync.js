/**
 * Synchronous editable child collection module.
 * @module editable-child-collection-sync
 */
'use strict';

var util = require('util');
var CollectionBase = require('./collection-base.js');
var ModelBase = require('./model-base.js');
var ensureArgument = require('./shared/ensure-argument.js');

var MODEL_STATE = require('./shared/model-state.js');

var EditableChildCollectionSyncCreator = function(name, itemType) {

  name = ensureArgument.isMandatoryString(name,
      'c_manString', 'EditableChildCollectionSyncCreator', 'name');
  itemType = ensureArgument.isMandatoryType(itemType, ModelBase,
      'c_itemType', 'EditableChildCollectionSyncCreator', 'EditableChildModelSync');

  var EditableChildCollectionSync = function (parent) {

    parent = ensureArgument.isMandatoryType(parent, ModelBase, 'c_parent', name, 'EditableModelSync');

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
          var item = itemType.create(parent);
          item.fromCto(cto);
          items.push(item);
        });
      }
    };

    //endregion

    //region Actions

    this.create = function () {
      var item = itemType.create(parent);
      items.push(item);
      return item;
    };

    this.fetch = function (data) {
      if (data instanceof Array) {
        data.forEach(function (dto) {
          var item = itemType.load(parent, dto);
          items.push(item);
        });
      }
    };

    this.remove = function () {
      items.forEach(function (item) {
        item.remove();
      });
    };

    this.save = function () {
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        item = item.save();
      }
      items = items.filter(function (item) {
        return item.getModelState() !== MODEL_STATE.getName(MODEL_STATE.removed);
      });
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
  util.inherits(EditableChildCollectionSync, CollectionBase);

  return EditableChildCollectionSync;
};

module.exports = EditableChildCollectionSyncCreator;
