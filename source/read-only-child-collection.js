'use strict';

//region Imports

var util = require('util');
var Argument = require('./system/argument-check.js');

var CollectionBase = require('./collection-base.js');
var ModelError = require('./shared/model-error.js');

var CLASS_NAME = 'ReadOnlyChildCollection';

//endregion

/**
 * Factory method to create definitions of asynchronous read-only child collections.
 *
 *    Valid collection item types are:
 *
 *      * ReadOnlyChildObject
 *
 * @function bo.ReadOnlyChildCollection
 * @param {string} name - The name of the collection.
 * @param {ReadOnlyChildObject} itemType - The model type of the collection items.
 * @returns {ReadOnlyChildCollection} The constructor of an asynchronous read-only child collection.
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The collection name must be a non-empty string.
 * @throws {@link bo.shared.ModelError Model error}: The item type must be an ReadOnlyChildObject.
 */
var ReadOnlyChildCollectionFactory = function (name, itemType) {

  name = Argument.inConstructor(CLASS_NAME)
      .check(name).forMandatory('name').asString();

  // Check tree reference.
  if (typeof itemType !== 'string') {
    // Verify the model type of the item type.
    if (itemType.modelType !== 'ReadOnlyChildObject')
      throw new ModelError('invalidItem',
          itemType.prototype.name, itemType.modelType,
          CLASS_NAME, 'ReadOnlyChildObject');
  }

  /**
   * @classdesc
   *    Represents the definition of an asynchronous read-only child collection.
   * @description
   *    Creates a new asynchronous read-only child collection instance.
   *
   *    _The name of the model type available as:
   *    __&lt;instance&gt;.constructor.modelType__, returns 'ReadOnlyChildCollection'._
   *
   *    Valid parent model types are:
   *
   *      * ReadOnlyRootObject
   *      * ReadOnlyChildObject
   *      * CommandObject
   *
   * @name ReadOnlyChildCollection
   * @constructor
   * @param {object} parent - The parent business object.
   * @param {bo.shared.EventHandlerList} [eventHandlers] - The event handlers of the instance.
   *
   * @extends CollectionBase
   *
   * @throws {@link bo.system.ArgumentError Argument error}:
   *    The parent object must be an ReadOnlyRootObject, ReadOnlyChildObject
   *    or CommandObject instance.
   */
  var ReadOnlyChildCollection = function (parent, eventHandlers) {
    CollectionBase.call(this);

    // Verify the model type of the parent model.
    parent = Argument.inConstructor(name).check(parent).for('parent').asModelType([
      'ReadOnlyRootObject',
      'ReadOnlyChildObject',
      'CommandObject'
    ]);

    // Resolve tree reference.
    if (typeof itemType === 'string') {
      if (itemType === parent.$modelName)
        itemType = parent.constructor;
      else
        throw new ModelError('invalidTree', itemType, parent.$modelName);
    }

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
     * @returns {Array.<object>} The client transfer object.
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
     *
     * _This method is called by the parent object._
     *
     * @function ReadOnlyChildCollection#fetch
     * @protected
     * @param {Array.<object>} [data] - The data to load into the business object collection.
     * @returns {promise<ReadOnlyChildCollection>} Returns a promise to the end of load.
     */
    this.fetch = function ( data ) {
      return data instanceof Array && data.length ?
        Promise.all( data.map( dto => {
          return itemType.load( parent, dto, eventHandlers )
        }))
          .then( list => {
            // Add loaded items to the collection.
            list.forEach( item => {
              items.push( item );
            });
            // Nothing to return.
            return null;
          }) :
        Promise.resolve( null );
    };

    /**
     * Indicates whether all items of the business collection are valid.
     *
     * _This method is called by the parent object._
     *
     * @function ReadOnlyChildCollection#isValid
     * @protected
     * @returns {boolean}
     */
    this.isValid = function () {
      return items.every(function (item) {
        return item.isValid();
      })
    };

    /**
     * Executes validation on all items of the collection.
     *
     * _This method is called by the parent object._
     *
     * @function ReadOnlyChildCollection#checkRules
     * @protected
     */
    this.checkRules = function () {
      items.forEach(function (item) {
        item.checkRules();
      });
    };

    /**
     * Gets the broken rules of all items of the collection.
     *
     * _This method is called by the parent object._
     *
     * @function ReadOnlyChildCollection#getBrokenRules
     * @protected
     * @param {string} [namespace] - The namespace of the message keys when messages are localizable.
     * @returns {Array.<bo.rules.BrokenRulesOutput>} The broken rules of the collection.
     */
    this.getBrokenRules = function(namespace) {
      var bro = [];
      items.forEach(function (item) {
        var childBrokenRules = item.getBrokenRules(namespace);
        if (childBrokenRules)
          bro.push(childBrokenRules);
      });
      return bro.length ? bro : null;
    };

    //endregion

    //region Public array methods

    /**
     * Gets a collection item at a specific position.
     *
     * @function ReadOnlyChildCollection#at
     * @param {number} index - The index of the required item in the collection.
     * @returns {ReadOnlyChildObject} The required collection item.
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
     * @returns {Array.<ReadOnlyChildObject>} The new array of collection items.
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
