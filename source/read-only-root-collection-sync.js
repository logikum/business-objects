'use strict';

//region Imports

var util = require('util');
var config = require('./shared/configuration-reader.js');
var EnsureArgument = require('./system/ensure-argument.js');

var CollectionBase = require('./collection-base.js');
var ModelError = require('./shared/model-error.js');
var ExtensionManagerSync = require('./shared/extension-manager-sync.js');
var EventHandlerList = require('./shared/event-handler-list.js');

var RuleManager = require('./rules/rule-manager.js');
var BrokenRuleList = require('./rules/broken-rule-list.js');
var AuthorizationAction = require('./rules/authorization-action.js');
var AuthorizationContext = require('./rules/authorization-context.js');

var DataPortalAction = require('./shared/data-portal-action.js');
var DataPortalContext = require('./shared/data-portal-context.js');
var DataPortalEvent = require('./shared/data-portal-event.js');
var DataPortalEventArgs = require('./shared/data-portal-event-args.js');
var DataPortalError = require('./shared/data-portal-error.js');

var CLASS_NAME = 'ReadOnlyRootCollectionSync';
var MODEL_DESC = 'Read-only root collection';
var M_FETCH = DataPortalAction.getName(DataPortalAction.fetch);

//endregion

/**
 * Factory method to create definitions of synchronous read-only root collections.
 *
 * @function bo.ReadOnlyRootCollectionSync
 * @param {string} name - The name of the collection.
 * @param {ReadOnlyChildModelSync} itemType - The model type of the collection items.
 * @param {bo.shared.RuleManager} rules - The validation and authorization rules.
 * @param {bo.shared.ExtensionManagerSync} extensions - The customization of the collection.
 * @returns {ReadOnlyRootCollectionSync} The constructor of a synchronous read-only root collection.
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The collection name must be a non-empty string.
 * @throws {@link bo.system.ArgumentError Argument error}: The rules must be a RuleManager object.
 * @throws {@link bo.system.ArgumentError Argument error}: The extensions must be a ExtensionManagerSync object.
 * @throws {@link bo.shared.ModelError Model error}: The item type must be an ReadOnlyChildModelSync.
 */
var ReadOnlyRootCollectionSyncFactory = function (name, itemType, rules, extensions) {

  name = EnsureArgument.isMandatoryString(name,
      'c_manString', CLASS_NAME, 'name');
  rules = EnsureArgument.isMandatoryType(rules, RuleManager,
      'c_manType', CLASS_NAME, 'rules');
  extensions = EnsureArgument.isMandatoryType(extensions, ExtensionManagerSync,
      'c_manType', CLASS_NAME, 'extensions');

  // Verify the model type of the item type.
  if (itemType.modelType !== 'ReadOnlyChildModelSync')
    throw new ModelError('invalidItem',
        itemType.prototype.name, itemType.modelType,
        CLASS_NAME, 'ReadOnlyChildModelSync');

  /**
   * @classdesc
   *    Represents the definition of a synchronous read-only root collection.
   * @description
   *    Creates a new synchronous read-only root collection instance.
   *
   *    _The name of the model type available as:
   *    __&lt;instance&gt;.constructor.modelType__, returns 'ReadOnlyRootCollectionSync'._
   *
   * @name ReadOnlyRootCollectionSync
   * @constructor
   * @param {bo.shared.EventHandlerList} [eventHandlers] - The event handlers of the instance.
   *
   * @extends ModelBase
   *
   * @throws {@link bo.system.ArgumentError Argument error}:
   *    The event handlers must be an EventHandlerList object or null.
   *
   * @fires ReadOnlyRootCollectionSync#preFetch
   * @fires ReadOnlyRootCollectionSync#postFetch
   */
  var ReadOnlyRootCollectionSync = function (eventHandlers) {
    CollectionBase.call(this);

    eventHandlers = EnsureArgument.isOptionalType(eventHandlers, EventHandlerList,
        'c_optType', name, 'eventHandlers');

    var self = this;
    var items = [];
    var brokenRules = new BrokenRuleList(name);
    var isValidated = false;
    var dao = null;
    var dataContext = null;
    var connection = null;
    var totalItems = null;

    // Get data access object.
    if (extensions.daoBuilder)
      dao = extensions.daoBuilder(extensions.dataSource, extensions.modelPath);
    else
      dao = config.daoBuilder(extensions.dataSource, extensions.modelPath);

    /**
     * The name of the model.
     *
     * @name ReadOnlyRootCollectionSync#$modelName
     * @type {string}
     * @readonly
     */
    this.$modelName = name;

    /**
     * The count of the child objects in the collection.
     *
     * @name ReadOnlyRootCollectionSync#count
     * @type {number}
     * @readonly
     */
    Object.defineProperty(self, 'count', {
      get: function () {
        return items.length;
      },
      enumerable: false
    });

    /**
     * The count of all available items if provided by the data access object.
     *
     * @name ReadOnlyRootCollectionSync#totalItems
     * @type {number}
     * @readonly
     */
    Object.defineProperty(self, 'totalItems', {
      get: function () {
        return totalItems;
      },
      enumerable: false
    });

    // Set up event handlers.
    if (eventHandlers)
      eventHandlers.setup(self);

    //region Transfer object methods

    /**
     * Transforms the business object collection to a plain object array to send to the client.
     *
     * @function ReadOnlyRootCollectionSync#toCto
     * @returns {Array.<{}>} The client transfer object.
     */
    this.toCto = function () {
      var cto = [];
      items.forEach(function (item) {
        cto.push(item.toCto());
      });
      if (totalItems)
        cto.totalItems = totalItems;
      return cto;
    };

    //endregion

    //region Permissions

    function getAuthorizationContext(action, targetName) {
      return new AuthorizationContext(action, targetName || '', brokenRules);
    }

    function canDo (action) {
      return rules.hasPermission(
        getAuthorizationContext(action)
      );
    }

    function canExecute (methodName) {
      return rules.hasPermission(
        getAuthorizationContext(AuthorizationAction.executeMethod, methodName)
      );
    }

    //endregion

    //region Data portal methods

    //region Helper

    function getDataContext (connection) {
      if (!dataContext)
        dataContext = new DataPortalContext(dao);
      return dataContext.setState(connection, false);
    }

    function raiseEvent (event, methodName, error) {
      self.emit(
          DataPortalEvent.getName(event),
          new DataPortalEventArgs(event, name, null, methodName, error),
          self
      );
    }

    function wrapError (error) {
      return new DataPortalError(MODEL_DESC, name, DataPortalAction.fetch, error);
    }

    //endregion

    //region Fetch

    function data_fetch (filter, method) {
      // Check permissions.
      if (method === M_FETCH ? canDo(AuthorizationAction.fetchObject) : canExecute(method)) {
        try {
          // Open connection.
          connection = config.connectionManager.openConnection(extensions.dataSource);
          // Launch start event.
          /**
           * The event arises before the collection instance will be retrieved from the repository.
           * @event ReadOnlyRootCollectionSync#preFetch
           * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
           * @param {ReadOnlyRootCollectionSync} oldObject - The collection instance before the data portal action.
           */
          raiseEvent(DataPortalEvent.preFetch, method);
          // Execute fetch.
          var dto = null;
          if (extensions.dataFetch) {
            // *** Custom fetch.
            dto = extensions.dataFetch.call(self, getDataContext(connection), filter, method);
          } else {
            // *** Standard fetch.
            // Root element fetches data from repository.
            dto = dao.$runMethod(method, connection, filter);
          }
          // Get the count of all available items.
          if (dto.totalItems &&
             (typeof dto.totalItems === 'number' || dto.totalItems instanceof Number) &&
              dto.totalItems % 1 === 0)
            totalItems = dto.totalItems;
          else
            totalItems = null;
          // Load children.
          if (dto instanceof Array) {
            dto.forEach(function (data) {
              var item = itemType.load(self, data, eventHandlers);
              items.push(item);
            });
          }
          // Launch finish event.
          /**
           * The event arises after the collection instance has been retrieved from the repository.
           * @event ReadOnlyRootCollectionSync#postFetch
           * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
           * @param {ReadOnlyRootCollectionSync} newObject - The collection instance after the data portal action.
           */
          raiseEvent(DataPortalEvent.postFetch, method);
          // Close connection.
          connection = config.connectionManager.closeConnection(extensions.dataSource, connection);
        } catch (e) {
          // Wrap the intercepted error.
          var dpError = wrapError(e);
          // Launch finish event.
          raiseEvent(DataPortalEvent.postFetch, method, dpError);
          // Close connection.
          connection = config.connectionManager.closeConnection(extensions.dataSource, connection);
          // Rethrow error.
          throw dpError;
        }
      }
    }

    //endregion

    //endregion

    //region Actions

    /**
     * Initializes a business object collection to be retrieved from the repository.
     * <br/>_This method is called by a factory method with the same name._
     *
     * @function ReadOnlyRootCollectionSync#fetch
     * @protected
     * @param {*} [filter] - The filter criteria.
     * @param {string} [method] - An alternative fetch method of the data access object.
     */
    this.fetch = function(filter, method) {
      data_fetch(filter, method || M_FETCH);
    };

    //endregion

    //region Validation

    /**
     * Indicates whether all the validation rules of the business objects in the
     * collection, including the ones of their child objects, succeeds. A valid collection
     * may have broken rules with severity of success, information and warning.
     *
     * _By default read-only business object collections are supposed to be valid._
     *
     * @function ReadOnlyRootCollectionSync#isValid
     * @returns {boolean} True when the business object is valid, otherwise false.
     */
    this.isValid = function() {
      if (!isValidated)
        this.checkRules();

      return brokenRules.isValid();
    };

    /**
     * Executes all the validation rules of all business objects in the collection,
     * including the ones of their child objects.
     *
     * _By default read-only business object collections are supposed to be valid._
     *
     * @function ReadOnlyRootCollectionSync#checkRules
     */
    this.checkRules = function() {
      brokenRules.clear();

      properties.forEach(function(property) {
        rules.validate(property, new ValidationContext(getPropertyValue, brokenRules));
      });
      isValidated = true;
    };

    /**
     * Gets the broken rules of the business object collection.
     *
     * _By default read-only business object collections are supposed to be valid._
     *
     * @function ReadOnlyRootCollectionSync#getBrokenRules
     * @param {string} [namespace] - The namespace of the message keys when messages are localizable.
     * @returns {bo.rules.BrokenRulesOutput} The broken rules of the business object collection.
     */
    this.getBrokenRules = function(namespace) {
      return brokenRules.output(namespace);
    };

    //endregion

    //region Public array methods

    /**
     * Gets a collection item at a specific position.
     *
     * @function ReadOnlyRootCollectionSync#at
     * @param {number} index - The index of the required item in the collection.
     * @returns {ReadOnlyChildModelSync} The required collection item.
     */
    this.at = function (index) {
      return items[index];
    };

    /**
     * Executes a provided function once per collection item.
     *
     * @function ReadOnlyRootCollectionSync#forEach
     * @param {external.cbCollectionItem} callback - Function that produces an item of the new collection.
     */
    this.forEach = function (callback) {
      items.forEach(callback);
    };

    /**
     * Tests whether all items in the collection pass the test implemented by the provided function.
     *
     * @function ReadOnlyRootCollectionSync#every
     * @param {external.cbCollectionItem} callback - Function to test for each collection item.
     * @returns {boolean} True when callback returns truthy value for each item, otherwise false.
     */
    this.every = function (callback) {
      return items.every(callback);
    };

    /**
     * Tests whether some item in the collection pass the test implemented by the provided function.
     *
     * @function ReadOnlyRootCollectionSync#some
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
     * @function ReadOnlyRootCollectionSync#filter
     * @param {external.cbCollectionItem} callback - Function to test for each collection item.
     * @returns {Array.<ReadOnlyChildModelSync>} The new array of collection items.
     */
    this.filter = function (callback) {
      return items.filter(callback);
    };

    /**
     * Creates a new array with the results of calling a provided function
     * on every item in this collection.
     *
     * @function ReadOnlyRootCollectionSync#map
     * @param {external.cbCollectionItem} callback - Function to test for each collection item.
     * @returns {Array.<*>} The new array of callback results.
     */
    this.map = function (callback) {
      return items.map(callback);
    };

    /**
     * Sorts the items of the collection in place and returns the collection.
     *
     * @function ReadOnlyRootCollectionSync#sort
     * @param {external.cbCompare} [fnCompare] - Function that defines the sort order.
     *      If omitted, the collection is sorted according to each character's Unicode
     *      code point value, according to the string conversion of each item.
     * @returns {ReadOnlyRootCollectionSync} The sorted collection.
     */
    this.sort = function (fnCompare) {
      return items.sort(fnCompare);
    };

    //endregion

    // Immutable object.
    Object.freeze(this);
  };
  util.inherits(ReadOnlyRootCollectionSync, CollectionBase);

  /**
   * The name of the model type.
   *
   * @property {string} ReadOnlyRootCollectionSync.constructor.modelType
   * @default ReadOnlyRootCollectionSync
   * @readonly
   */
  Object.defineProperty(ReadOnlyRootCollectionSync, 'modelType', {
    get: function () { return CLASS_NAME; }
  });

  //region Factory methods

  /**
   * Retrieves a read-only business object collection from the repository.
   *
   * @function ReadOnlyRootCollectionSync.fetch
   * @param {*} [filter] - The filter criteria.
   * @param {string} [method] - An alternative fetch method of the data access object.
   * @param {bo.shared.EventHandlerList} [eventHandlers] - The event handlers of the instance.
   * @returns {ReadOnlyRootCollectionSync} The required read-only business object collection.
   *
   * @throws {@link bo.rules.AuthorizationError Authorization error}:
   *      The user has no permission to execute the action.
   * @throws {@link bo.shared.DataPortalError Data portal error}:
   *    Fetching the business object collection has failed.
   */
  ReadOnlyRootCollectionSync.fetch = function(filter, method, eventHandlers) {
    var instance = new ReadOnlyRootCollectionSync(eventHandlers);
    instance.fetch(filter, method);
    return instance;
  };

  //endregion

  return ReadOnlyRootCollectionSync;
};

module.exports = ReadOnlyRootCollectionSyncFactory;
