'use strict';

//region Imports

var util = require('util');
var EnsureArgument = require('./system/ensure-argument.js');

var CollectionBase = require('./collection-base.js');
var ModelError = require('./shared/model-error.js');

var CLASS_NAME = 'ReadOnlyChildCollection';

//endregion

/**
 * Factory method to create definitions of asynchronous read-only child collections.
 *
 * @function bo.ReadOnlyChildCollection
 * @param {string} name - The name of the collection.
 * @param {ReadOnlyChildModel} itemType - The model type of the collection items.
 * @returns {ReadOnlyChildCollection} The constructor of an asynchronous read-only child collection.
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The collection name must be a non-empty string.
 * @throws {@link bo.shared.ModelError Model error}: The item type must be an ReadOnlyChildModel.
 */
var ReadOnlyChildCollectionFactory = function (name, itemType) {

  name = EnsureArgument.isMandatoryString(name,
      'c_manString', CLASS_NAME, 'name');

  // Verify the model type of the item type.
  if (itemType.modelType !== 'ReadOnlyChildModel')
    throw new ModelError('invalidItem',
        itemType.prototype.name, itemType.modelType,
        CLASS_NAME, 'ReadOnlyChildModel');

  /**
   * @classdesc
   *    Represents the definition of an asynchronous read-only child collection.
   * @description
   *    Creates a new asynchronous read-only child collection instance.
   *
   * @name ReadOnlyChildCollection
   * @constructor
   * @param {{}} parent - The parent business object.
   * @param {bo.shared.EventHandlerList} [eventHandlers] - The event handlers of the instance.
   *
   * @extends CollectionBase
   *
   * @throws {@link bo.system.ArgumentError Argument error}:
   *    The parent object must be an ReadOnlyRootModel, ReadOnlyChildModel
   *    or CommandObject instance.
   */
  var ReadOnlyChildCollection = function (parent, eventHandlers) {
    CollectionBase.call(this);

    // Verify the model type of the parent model.
    parent = EnsureArgument.isModelType(parent,
        [
          'ReadOnlyRootModel',
          'ReadOnlyChildModel',
          'CommandObject'
        ],
        'c_modelType', name, 'parent');

    var self = this;
    var items = [];

    /**
     * The name of the model.
     *
     * @name ReadOnlyChildCollection#$modelName
     * @type {string}
     * @readonly
     */
    this.$modelName = name;

    /**
     * The count of the child objects in the collection.
     *
     * @name ReadOnlyChildCollection#count
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
     * @function ReadOnlyChildCollection#toCto
     * @returns {Array.<{}>} The client transfer object.
     */
    this.toCto = function () {
      var cto = [];
      items.forEach(function (item) {
        cto.push(item.toCto());
      });
      return cto;
    };

    //endregion

    //region Actions

    /**
     * Initializes the items in the collection with data retrieved from the repository.
     * <br/>_This method is called by the parent object._
     *
     * @function ReadOnlyChildCollection#fetch
     * @protected
     * @param {Array.<{}>} [data] - The data to load into the business object collection.
     * @param {external.cbDataPortal} callback - Returns the eventual error.
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

    //endregion

    //region Public array methods

    /**
     * Gets a collection item at a specific position.
     *
     * @function ReadOnlyChildCollection#at
     * @param {number} index - The index of the required item in the collection.
     * @returns {ReadOnlyChildModel} The required collection item.
     */
    this.at = function (index) {
      return items[index];
    };

    /**
     * Executes a provided function once per collection item.
     *
     * @function ReadOnlyChildCollection#forEach
     * @param {external.cbCollectionItem} callback - Function that produces an item of the new collection.
     */
    this.forEach = function (callback) {
      items.forEach(callback);
    };

    /**
     * Tests whether all items in the collection pass the test implemented by the provided function.
     *
     * @function ReadOnlyChildCollection#every
     * @param {external.cbCollectionItem} callback - Function to test for each collection item.
     * @returns {boolean} True when callback returns truthy value for each item, otherwise false.
     */
    this.every = function (callback) {
      return items.every(callback);
    };

    /**
     * Tests whether some item in the collection pass the test implemented by the provided function.
     *
     * @function ReadOnlyChildCollection#some
     * @param {external.cbCollectionItem} callback - Function to test for each collection item.
     * @returns {boolean} True when callback returns truthy value for some item, otherwise false.
     */
    this.some = function (callback) {
      return items.some(callback);
    };

    /**
     * Creates a new array with all collection items that pass the test
     * implemented by the provided function.
     *
     * @function ReadOnlyChildCollection#filter
     * @param {external.cbCollectionItem} callback - Function to test for each collection item.
     * @returns {Array.<ReadOnlyChildModel>} The new array of collection items.
     */
    this.filter = function (callback) {
      return items.filter(callback);
    };

    /**
     * Creates a new array with the results of calling a provided function
     * on every item in this collection.
     *
     * @function ReadOnlyChildCollection#map
     * @param {external.cbCollectionItem} callback - Function to test for each collection item.
     * @returns {Array.<*>} The new array of callback results.
     */
    this.map = function (callback) {
      return items.map(callback);
    };

    /**
     * Sorts the items of the collection in place and returns the collection.
     *
     * @function ReadOnlyChildCollection#sort
     * @param {external.cbCompare} [fnCompare] - Function that defines the sort order.
     *      If omitted, the collection is sorted according to each character's Unicode
     *      code point value, according to the string conversion of each item.
     * @returns {ReadOnlyChildCollection} The sorted collection.
     */
    this.sort = function (fnCompare) {
      return items.sort(fnCompare);
    };

    //endregion

    // Immutable object.
    Object.freeze(this);
  };
  util.inherits(ReadOnlyChildCollection, CollectionBase);

  /**
   * The name of the model type.
   *
   * @property {string} ReadOnlyChildCollection.constructor.modelType
   * @default ReadOnlyChildCollection
   * @readonly
   */
  Object.defineProperty(ReadOnlyChildCollection, 'modelType', {
    get: function () { return CLASS_NAME; }
  });

  return ReadOnlyChildCollection;
};

module.exports = ReadOnlyChildCollectionFactory;
