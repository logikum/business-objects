'use strict';

//region Imports

var util = require('util');
var EnsureArgument = require('./system/ensure-argument.js');

var CollectionBase = require('./collection-base.js');
var ModelError = require('./shared/model-error.js');

var MODEL_STATE = require('./shared/model-state.js');

//endregion

/**
 * Factory method to create definitions of asynchronous editable child collections.
 *
 * @function bo.EditableChildCollection
 * @param {string} name - The name of the collection.
 * @param {EditableChildModel} itemType - The model type of the collection items.
 * @returns {EditableChildCollection} The constructor of an asynchronous editable child collection.
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The collection name must be a non-empty string.
 * @throws {@link bo.shared.ModelError Model error}: The item type must be an EditableChildModel.
 */
var EditableChildCollectionFactory = function(name, itemType) {

  name = EnsureArgument.isMandatoryString(name,
      'c_manString', 'EditableChildCollection', 'name');

  // Verify the model type of the item type.
  if (itemType.modelType !== 'EditableChildModel')
    throw new ModelError('invalidItem',
        itemType.prototype.name, itemType.modelType, 'EditableChildCollection', 'EditableChildModel');

  /**
   * @classdesc
   *    Represents the definition of an asynchronous editable child collection.
   * @description
   *    Creates a new asynchronous editable child collection instance.
   *
   *    _The name of the model type available as:
   *    __&lt;instance&gt;.constructor.modelType__, returns 'EditableChildCollection'._
   *
   * @name EditableChildCollection
   * @constructor
   * @param {{}} parent - The parent business object.
   * @param {bo.shared.EventHandlerList} [eventHandlers] - The event handlers of the instance.
   *
   * @extends CollectionBase
   *
   * @throws {@link bo.system.ArgumentError Argument error}:
   *    The parent object must be an EditableRootModel or EditableChildModel instance.
   */
  var EditableChildCollection = function (parent, eventHandlers) {
    CollectionBase.call(this);

    // Verify the model type of the parent model.
    parent = EnsureArgument.isModelType(parent,
        [
          'EditableRootModel',
          'EditableChildModel'
        ],
        'c_modelType', name, 'parent');

    var self = this;
    var items = [];

    /**
     * The name of the model.
     *
     * @name EditableChildCollection#$modelName
     * @type {string}
     * @readonly
     */
    this.$modelName = name;

    /**
     * The count of the child objects in the collection.
     *
     * @name EditableChildCollection#count
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
     * @function EditableChildCollection#toCto
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
     * @function EditableChildCollection#fromCto
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
          itemType.create(parent, eventHandlers, function (err, item) {
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

    /**
     * Creates a new item in the collection.
     *
     * @function EditableChildCollection#create
     * @param {external~cbDataPortal} callback - Returns the newly created editable business object.
     */
    this.create = function (callback) {
      itemType.create(parent, eventHandlers, function (err, item) {
        if (err)
          callback(err);
        items.push(item);
        callback(null, item);
      });
    };

    /**
     * Initializes the items in the collection with data retrieved from the repository.
     * <br/>_This method is called by the parent object._
     *
     * @function EditableChildCollection#fetch
     * @protected
     * @param {Array.<{}>} [data] - The data to load into the business object collection.
     * @param {external~cbDataPortal} callback - Returns the eventual error.
     */
    this.fetch = function (data, callback) {
      if (data instanceof Array && data.length) {
        var count = 0;
        var error = null;
        data.forEach(function (dto) {
          itemType.load(parent, dto, eventHandlers, function (err, item) {
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

    /**
     * Saves the changes of the business object collection to the repository.
     * <br/>_This method is called by the parent object._
     *
     * @function EditableChildCollection#save
     * @protected
     * @param {{}} connection - The connection data.
     * @param {external~cbDataPortal} callback - Returns the eventual error.
     */
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

    /**
     * Marks all items in the collection to be deleted from the repository on next save.
     *
     * @function EditableChildCollection#remove
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
     * @function EditableChildCollection#at
     * @param {number} index - The index of the required item in the collection.
     * @returns {EditableChildModel} The required collection item.
     */
    this.at = function (index) {
      return items[index];
    };

    /**
     * Executes a provided function once per collection item.
     *
     * @function EditableChildCollection#forEach
     * @param {external~cbCollectionItem} callback - Function that produces an item of the new collection.
     */
    this.forEach = function (callback) {
      items.forEach(callback);
    };

    /**
     * Tests whether all items in the collection pass the test implemented by the provided function.
     *
     * @function EditableChildCollection#every
     * @param {external~cbCollectionItem} callback - Function to test for each collection item.
     * @returns {boolean} True when callback returns truthy value for each item, otherwise false.
     */
    this.every = function (callback) {
      return items.every(callback);
    };

    /**
     * Tests whether some item in the collection pass the test implemented by the provided function.
     *
     * @function EditableChildCollection#some
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
     * @function EditableChildCollection#filter
     * @param {external~cbCollectionItem} callback - Function to test for each collection item.
     * @returns {Array.<EditableChildModel>} The new array of collection items.
     */
    this.filter = function (callback) {
      return items.filter(callback);
    };

    /**
     * Creates a new array with the results of calling a provided function
     * on every item in this collection.
     *
     * @function EditableChildCollection#map
     * @param {external~cbCollectionItem} callback - Function to test for each collection item.
     * @returns {Array.<*>} The new array of callback results.
     */
    this.map = function (callback) {
      return items.map(callback);
    };

    /**
     * Sorts the items of the collection in place and returns the collection.
     *
     * @function EditableChildCollection#sort
     * @param {external~cbCompare} [fnCompare] - Function that defines the sort order.
     *      If omitted, the collection is sorted according to each character's Unicode
     *      code point value, according to the string conversion of each item.
     * @returns {EditableChildCollection} The sorted collection.
     */
    this.sort = function (fnCompare) {
      return items.sort(fnCompare);
    };

    //endregion

    // Immutable object.
    Object.freeze(this);
  };
  util.inherits(EditableChildCollection, CollectionBase);

  /**
   * The name of the model type.
   *
   * @property {string} EditableChildCollection.constructor.modelType
   * @default EditableChildCollection
   * @readonly
   */
  Object.defineProperty(EditableChildCollection, 'modelType', {
    get: function () { return 'EditableChildCollection'; }
  });

  return EditableChildCollection;
};

module.exports = EditableChildCollectionFactory;
