'use strict';

//region Imports

var util = require('util');
var Argument = require('./system/argument-check.js');

var CollectionBase = require('./collection-base.js');
var ModelError = require('./shared/model-error.js');

var MODEL_STATE = require('./shared/model-state.js');
var CLASS_NAME = 'EditableChildCollection';

//endregion

/**
 * Factory method to create definitions of asynchronous editable child collections.
 *
 *    Valid collection item types are:
 *
 *      * EditableChildObject
 *
 * @function bo.EditableChildCollection
 * @param {string} name - The name of the collection.
 * @param {EditableChildObject} itemType - The model type of the collection items.
 * @returns {EditableChildCollection} The constructor of an asynchronous editable child collection.
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The collection name must be a non-empty string.
 * @throws {@link bo.shared.ModelError Model error}: The item type must be an EditableChildObject.
 */
var EditableChildCollectionFactory = function (name, itemType) {

  name = Argument.inConstructor(CLASS_NAME)
      .check(name).forMandatory('name').asString();

  // Check tree reference.
  if (typeof itemType !== 'string') {
    // Verify the model type of the item type.
    if (itemType.modelType !== 'EditableChildObject')
      throw new ModelError('invalidItem',
          itemType.prototype.name, itemType.modelType,
          CLASS_NAME, 'EditableChildObject');
  }

  /**
   * @classdesc
   *    Represents the definition of an asynchronous editable child collection.
   * @description
   *    Creates a new asynchronous editable child collection instance.
   *
   *    _The name of the model type available as:
   *    __&lt;instance&gt;.constructor.modelType__, returns 'EditableChildCollection'._
   *
   *    Valid parent model types are:
   *
   *      * EditableRootObject
   *      * EditableChildObject
   *
   * @name EditableChildCollection
   * @constructor
   * @param {object} parent - The parent business object.
   * @param {bo.shared.EventHandlerList} [eventHandlers] - The event handlers of the instance.
   *
   * @extends CollectionBase
   *
   * @throws {@link bo.system.ArgumentError Argument error}:
   *    The parent object must be an EditableRootObject or EditableChildObject instance.
   */
  var EditableChildCollection = function (parent, eventHandlers) {
    CollectionBase.call(this);

    // Verify the model type of the parent model.
    parent = Argument.inConstructor(name).check(parent).for('parent').asModelType([
      'EditableRootObject',
      'EditableChildObject'
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
     * @returns {Array.<object>} The client transfer object.
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
     * @param {Array.<object>} data - The array of client transfer objects.
     * @param {external.cbFromCto} callback - Returns the eventual error.
     */
    this.fromCto = function (data, callback) {
      if (!(data instanceof Array))
        callback(null);

      var dataNew = data.filter(function () { return true; });
      var itemsLive = [];
      var itemsLate = [];
      var count = 0;
      var error = null;
      var index;

      function finish() {
        if (++count == dataNew.length) {
          return callback(error);
        }
      }
      function handleOldNew() {
        count = 0;

        // Remove non existing items.
        for (index = 0; index < itemsLate.length; index++) {
          items[itemsLate[index]].remove();
        }
        // Insert non existing data.
        if (dataNew.length) {
          dataNew.forEach(function (cto) {
            itemType.create(parent, eventHandlers, function (err, item) {
              if (err) {
                error = error || err;
                finish();
              } else {
                item.fromCto(cto, function (err) {
                  if (err)
                    error = error || err;
                  else
                    items.push(item);
                  finish();
                });
              }
            });
          });
        } else
          return callback(null);
      }

      // Discover changed items.
      for (index = 0; index < items.length; index++) {
        var dataFound = false;
        var i = 0;
        for (; i < dataNew.length; i++) {
          if (items[index].keyEquals(data[i])) {
            itemsLive.push({ item: index, cto: i });
            dataFound = true;
            break;
          }
        }
        if (dataFound)
          dataNew.splice(i, 1);
        else
          itemsLate.push(index);
      }
      // Update existing items.
      if (itemsLive.length)
        for (index = 0; index < itemsLive.length; index++) {
          var ix = itemsLive[index];
          items[ix.item].fromCto(data[ix.cto], function (err) {
            if (err)
              error = error || err;
            if (++count == itemsLive.length)
              handleOldNew();
          });
        }
      else
        handleOldNew();
    };

    //endregion

    //region Actions

    /**
     * Creates a new item and adds it to the collection at the specified index.
     *
     * @function EditableChildCollection#create
     * @param {number} index - The index of the new item.
     * @returns {promise<EditableChildObject>} Returns a promise to
     *      the newly created editable business object.
     */
    this.createItem = function( index ) {
      return itemType.create( parent, eventHandlers )
        .then( item => {
          var ix = parseInt( index || items.length, 10 );
          ix = isNaN( ix ) ? items.length : ix;
          items.splice( ix, 0, item );
          return item;
      });
    };

    /**
     * Initializes the items in the collection with data retrieved from the repository.
     * <br/>_This method is called by the parent object._
     *
     * @function EditableChildCollection#fetch
     * @protected
     * @param {Array.<object>} [data] - The data to load into the business object collection.
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

    /**
     * Saves the changes of the business object collection to the repository.
     * <br/>_This method is called by the parent object._
     *
     * @function EditableChildCollection#save
     * @protected
     * @param {object} connection - The connection data.
     * @param {external.cbDataPortal} callback - Returns the eventual error.
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

    /**
     * Indicates whether all items of the business collection are valid.
     * <br/>_This method is called by the parent object._
     *
     * @function EditableChildCollection#isValid
     * @protected
     * @returns {boolean}
     */
    this.isValid = function () {
      return items.every(function (item) {
        return item.isValid();
      });
    };

    /**
     * Executes validation on all items of the collection.
     * <br/>_This method is called by the parent object._
     *
     * @function EditableChildCollection#checkRules
     * @protected
     */
    this.checkRules = function () {
      items.forEach(function (item) {
        item.checkRules();
      });
    };

    /**
     * Gets the broken rules of all items of the collection.
     * <br/>_This method is called by the parent object._
     *
     * @function EditableChildCollection#getBrokenRules
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
     * @function EditableChildCollection#at
     * @param {number} index - The index of the required item in the collection.
     * @returns {EditableChildObject} The required collection item.
     */
    this.at = function (index) {
      return items[index];
    };

    /**
     * Executes a provided function once per collection item.
     *
     * @function EditableChildCollection#forEach
     * @param {external.cbCollectionItem} callback - Function that produces an item of the new collection.
     */
    this.forEach = function (callback) {
      items.forEach(callback);
    };

    /**
     * Tests whether all items in the collection pass the test implemented by the provided function.
     *
     * @function EditableChildCollection#every
     * @param {external.cbCollectionItem} callback - Function to test for each collection item.
     * @returns {boolean} True when callback returns truthy value for each item, otherwise false.
     */
    this.every = function (callback) {
      return items.every(callback);
    };

    /**
     * Tests whether some item in the collection pass the test implemented by the provided function.
     *
     * @function EditableChildCollection#some
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
     * @function EditableChildCollection#filter
     * @param {external.cbCollectionItem} callback - Function to test for each collection item.
     * @returns {Array.<EditableChildObject>} The new array of collection items.
     */
    this.filter = function (callback) {
      return items.filter(callback);
    };

    /**
     * Creates a new array with the results of calling a provided function
     * on every item in this collection.
     *
     * @function EditableChildCollection#map
     * @param {external.cbCollectionItem} callback - Function to test for each collection item.
     * @returns {Array.<*>} The new array of callback results.
     */
    this.map = function (callback) {
      return items.map(callback);
    };

    /**
     * Sorts the items of the collection in place and returns the collection.
     *
     * @function EditableChildCollection#sort
     * @param {external.cbCompare} [fnCompare] - Function that defines the sort order.
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
    get: function () { return CLASS_NAME; }
  });

  return EditableChildCollection;
};

module.exports = EditableChildCollectionFactory;
