'use strict';

//region Imports

var util = require('util');
var EnsureArgument = require('./system/ensure-argument.js');

var CollectionBase = require('./collection-base.js');
var ModelError = require('./shared/model-error.js');

var MODEL_STATE = require('./shared/model-state.js');

//endregion

/**
 * Factory method to create definitions of synchronous editable child collections.
 *
 * @function bo.EditableChildCollectionSync
 * @param {string} name - The name of the collection.
 * @param {EditableChildModelSync} itemType - The model type of the collection items.
 * @returns {EditableChildCollectionSync} The constructor of a synchronous editable child collection.
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The collection name must be a non-empty string.
 * @throws {@link bo.shared.ModelError Model error}: The item type must be an EditableChildModelSync.
 */
var EditableChildCollectionSyncFactory = function(name, itemType) {

  name = EnsureArgument.isMandatoryString(name,
      'c_manString', 'EditableChildCollectionSync', 'name');

  // Verify the model type of the item type.
  if (itemType.modelType !== 'EditableChildModelSync')
    throw new ModelError('invalidItem',
        itemType.prototype.name, itemType.modelType, 'EditableChildCollectionSync', 'EditableChildModelSync');

  /**
   * @classdesc
   *    Represents the definition of a synchronous editable child collection.
   * @description
   *    Creates a new synchronous editable child collection instance.
   *
   *    _The name of the model type available as:
   *    __&lt;instance&gt;.constructor.modelType__, returns 'EditableChildCollectionSync'._
   *
   * @name EditableChildCollectionSync
   * @constructor
   * @param {{}} parent - The parent business object.
   *
   * @extends CollectionBase
   *
   * @throws {@link bo.system.ArgumentError Argument error}:
   *    The parent object must be an EditableRootModelSync or EditableChildModelSync instance.
   */
  var EditableChildCollectionSync = function (parent) {
    CollectionBase.call(this);

    // Verify the model type of the parent model.
    parent = EnsureArgument.isModelType(parent,
        [
          'EditableRootModelSync',
          'EditableChildModelSync'
        ],
        'c_modelType', name, 'parent');

    var self = this;
    var items = [];

    /**
     * The name of the model.
     *
     * @name EditableChildCollectionSync#$modelName
     * @type {string}
     * @readonly
     */
    this.$modelName = name;

    /**
     * The count of the child objects in the collection.
     *
     * @name EditableChildCollectionSync#count
     * @type {number}
     * @readonly
     */
    Object.defineProperty(self, 'count', {
      get: function () {
        return items.length;
      },
      enumerable: false
    });

    //region Transfer object methods

    /**
     * Transforms the business object collection to a plain object array to send to the client.
     * <br/>_This method is usually called by the parent object._
     *
     * @function EditableChildCollectionSync#toCto
     * @returns {Array.<{}>} The client transfer object.
     */
    this.toCto = function () {
      var cto = [];
      items.forEach(function (item) {
        cto.push(item.toCto());
      });
      return cto;
    };

    /**
     * Rebuilds the business object collection from a plain object array sent by the client.
     * <br/>_This method is usually called by the parent object._
     *
     * @function EditableChildCollectionSync#fromCto
     * @param {Array.<{}>} data - The array of client transfer objects.
     */
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

    /**
     * Creates a new item in the collection.
     *
     * @function EditableChildCollectionSync#create
     * @returns {EditableChildModelSync} The newly created business object.
     */
    this.create = function () {
      var item = itemType.create(parent);
      items.push(item);
      return item;
    };

    /**
     * Initializes the items in the collection with data retrieved from the repository.
     * <br/>_This method is called by the parent object._
     *
     * @function EditableChildCollectionSync#fetch
     * @protected
     * @param {Array.<{}>} [data] - The data to load into the business object collection.
     */
    this.fetch = function (data) {
      if (data instanceof Array) {
        data.forEach(function (dto) {
          var item = itemType.load(parent, dto);
          items.push(item);
        });
      }
    };

    /**
     * Saves the changes of the business object collection to the repository.
     * <br/>_This method is called by the parent object._
     *
     * @function EditableChildCollectionSync#save
     * @protected
     * @param {{}} connection - The connection data.
     */
    this.save = function (connection) {
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        item = item.save(connection);
      }
      items = items.filter(function (item) {
        return item.getModelState() !== MODEL_STATE.getName(MODEL_STATE.removed);
      });
    };

    /**
     * Marks all items in the collection to be deleted from the repository on next save.
     *
     * @function EditableChildCollectionSync#remove
     */
    this.remove = function () {
      items.forEach(function (item) {
        item.remove();
      });
    };

    //endregion

    //region Public array methods

    /**
     * Gets a collection item at a specific position.
     *
     * @function EditableChildCollectionSync#at
     * @param {number} index - The index of the required item in the collection.
     * @returns {EditableChildModelSync} The required collection item.
     */
    this.at = function (index) {
      return items[index];
    };

    /**
     * Executes a provided function once per collection item.
     *
     * @function EditableChildCollectionSync#forEach
     * @param {external~cbCollectionItem} callback - Function that produces an item of the new collection.
     */
    this.forEach = function (callback) {
      items.forEach(callback);
    };

    /**
     * Tests whether all items in the collection pass the test implemented by the provided function.
     *
     * @function EditableChildCollectionSync#every
     * @param {external~cbCollectionItem} callback - Function to test for each collection item.
     * @returns {boolean} True when callback returns truthy value for each item, otherwise false.
     */
    this.every = function (callback) {
      return items.every(callback);
    };

    /**
     * Tests whether some item in the collection pass the test implemented by the provided function.
     *
     * @function EditableChildCollectionSync#some
     * @param {external~cbCollectionItem} callback - Function to test for each collection item.
     * @returns {boolean} True when callback returns truthy value for some item, otherwise false.
     */
    this.some = function (callback) {
      return items.some(callback);
    };

    /**
     * Creates a new array with all collection items that pass the test
     * implemented by the provided function.
     *
     * @function EditableChildCollectionSync#filter
     * @param {external~cbCollectionItem} callback - Function to test for each collection item.
     * @returns {Array.<EditableChildModelSync>} The new array of collection items.
     */
    this.filter = function (callback) {
      return items.filter(callback);
    };

    /**
     * Creates a new array with the results of calling a provided function
     * on every item in this collection.
     *
     * @function EditableChildCollectionSync#map
     * @param {external~cbCollectionItem} callback - Function to test for each collection item.
     * @returns {Array.<*>} The new array of callback results.
     */
    this.map = function (callback) {
      return items.map(callback);
    };

    /**
     * Sorts the items of the collection in place and returns the collection.
     *
     * @function EditableChildCollectionSync#sort
     * @param {external~cbCompare} [fnCompare] - Function that defines the sort order.
     *      If omitted, the collection is sorted according to each character's Unicode
     *      code point value, according to the string conversion of each item.
     * @returns {EditableChildCollectionSync} The sorted collection.
     */
    this.sort = function (fnCompare) {
      return items.sort(fnCompare);
    };

    //endregion

    // Immutable object.
    Object.freeze(this);
  };
  util.inherits(EditableChildCollectionSync, CollectionBase);

  /**
   * The name of the model type.
   *
   * @property {string} EditableChildCollectionSync.constructor.modelType
   * @default EditableChildCollectionSync
   * @readonly
   */
  Object.defineProperty(EditableChildCollectionSync, 'modelType', {
    get: function () { return 'EditableChildCollectionSync'; }
  });

  return EditableChildCollectionSync;
};

module.exports = EditableChildCollectionSyncFactory;
