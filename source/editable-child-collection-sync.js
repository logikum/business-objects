'use strict';

var util = require('util');
var CollectionBase = require('./collection-base.js');
var ensureArgument = require('./shared/ensure-argument.js');
var ModelError = require('./shared/model-error.js');

var MODEL_STATE = require('./shared/model-state.js');

/**
 * Factory method to create definitions of synchronous editable child collections.
 *
 * @function bo.EditableChildCollectionSync
 * @param {string} name - The name of the collection.
 * @param {EditableChildModelSync} itemType - The model type of the collection items.
 * @returns {EditableChildCollectionSync} The constructor of a synchronous editable child collection.
 *
 * @throws {@link bo.shared.ArgumentError Argument error}: The collection name must be a non-empty string.
 * @throws {@link bo.shared.ModelError Model error}: The item type must be an EditableChildModelSync.
 */
var EditableChildCollectionSyncFactory = function(name, itemType) {

  name = ensureArgument.isMandatoryString(name,
      'c_manString', 'EditableChildCollectionSync', 'name');

  // Verify the model type of the item type.
  if (itemType.modelType !== 'EditableChildModelSync')
    throw new ModelError('invalidItem',
        itemType.prototype.name, itemType.modelType, 'EditableChildCollectionSync', 'EditableChildModelSync');

  /**
   * @classdesc Represents the definition of a synchronous editable child collection.
   * @description Creates a new synchronous editable child collection instance.
   *
   * @name EditableChildCollectionSync
   * @constructor
   *
   * @extends CollectionBase
   */
  var EditableChildCollectionSync = function (parent) {

    // Verify the model type of the parent model.
    parent = ensureArgument.isModelType(parent, ['EditableRootModelSync', 'EditableChildModelSync'],
        'c_modelType', name, 'parent');

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

    this.save = function (connection) {
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        item = item.save(connection);
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

  EditableChildCollectionSync.modelType = 'EditableChildCollectionSync';

  return EditableChildCollectionSync;
};

module.exports = EditableChildCollectionSyncFactory;
