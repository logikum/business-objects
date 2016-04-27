'use strict';

//region Imports

var util = require('util');
var config = require('./shared/configuration-reader.js');
var Argument = require('./system/argument-check.js');

var CollectionBase = require('./collection-base.js');
var ModelError = require('./shared/model-error.js');
var ExtensionManager = require('./shared/extension-manager.js');
var EventHandlerList = require('./shared/event-handler-list.js');

var TransferContext = require('./shared/transfer-context.js');

var RuleManager = require('./rules/rule-manager.js');
var BrokenRuleList = require('./rules/broken-rule-list.js');
var AuthorizationAction = require('./rules/authorization-action.js');
var AuthorizationContext = require('./rules/authorization-context.js');
var BrokenRulesResponse = require('./rules/broken-rules-response.js');

var DataPortalAction = require('./shared/data-portal-action.js');
var DataPortalContext = require('./shared/data-portal-context.js');
var DataPortalEvent = require('./shared/data-portal-event.js');
var DataPortalEventArgs = require('./shared/data-portal-event-args.js');
var DataPortalError = require('./shared/data-portal-error.js');

var CLASS_NAME = 'ReadOnlyRootCollection';
var MODEL_DESC = 'Read-only root collection';
var M_FETCH = DataPortalAction.getName(DataPortalAction.fetch);

//endregion

/**
 * Factory method to create definitions of asynchronous read-only root collections.
 *
 *    Valid collection item types are:
 *
 *      * ReadOnlyChildObject
 *
 * @function bo.ReadOnlyRootCollection
 * @param {string} name - The name of the collection.
 * @param {ReadOnlyChildObject} itemType - The model type of the collection items.
 * @param {bo.shared.RuleManager} rules - The validation and authorization rules.
 * @param {bo.shared.ExtensionManager} extensions - The customization of the collection.
 * @returns {ReadOnlyRootCollection} The constructor of an asynchronous read-only root collection.
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The collection name must be a non-empty string.
 * @throws {@link bo.system.ArgumentError Argument error}: The rules must be a RuleManager object.
 * @throws {@link bo.system.ArgumentError Argument error}: The extensions must be a ExtensionManager object.
 * @throws {@link bo.shared.ModelError Model error}: The item type must be an ReadOnlyChildObject.
 */
var ReadOnlyRootCollectionFactory = function (name, itemType, rules, extensions) {
  var check = Argument.inConstructor(CLASS_NAME);

  name = check(name).forMandatory('name').asString();
  rules = check(rules).forMandatory('rules').asType(RuleManager);
  extensions = check(extensions).forMandatory('extensions').asType(ExtensionManager);

  // Verify the model type of the item type.
  if (itemType.modelType !== 'ReadOnlyChildObject')
    throw new ModelError('invalidItem',
        itemType.prototype.name, itemType.modelType,
        CLASS_NAME, 'ReadOnlyChildObject');

  // Get data access object.
  var dao = extensions.getDataAccessObject(name);

  /**
   * @classdesc
   *    Represents the definition of an asynchronous read-only root collection.
   * @description
   *    Creates a new asynchronous read-only root collection instance.
   *
   *    _The name of the model type available as:
   *    __&lt;instance&gt;.constructor.modelType__, returns 'ReadOnlyRootCollection'._
   *
   * @name ReadOnlyRootCollection
   * @constructor
   * @param {bo.shared.EventHandlerList} [eventHandlers] - The event handlers of the instance.
   *
   * @extends CollectionBase
   *
   * @throws {@link bo.system.ArgumentError Argument error}:
   *    The event handlers must be an EventHandlerList object or null.
   *
   * @fires ReadOnlyRootCollection#preFetch
   * @fires ReadOnlyRootCollection#postFetch
   */
  var ReadOnlyRootCollection = function (eventHandlers) {
    CollectionBase.call(this);

    eventHandlers = Argument.inConstructor(name)
        .check(eventHandlers).forOptional('eventHandlers').asType(EventHandlerList);

    var self = this;
    var items = [];
    var brokenRules = new BrokenRuleList(name);
    var isValidated = false;
    var dataContext = null;
    var totalItems = null;

    /**
     * The name of the model.
     *
     * @name ReadOnlyRootCollection#$modelName
     * @type {string}
     * @readonly
     */
    this.$modelName = name;

    /**
     * The count of the child objects in the collection.
     *
     * @name ReadOnlyRootCollection#count
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
     * @name ReadOnlyRootCollection#totalItems
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

    function getTransferContext () {
      return new TransferContext(null, null, null);
    }

    function baseToCto() {
      var cto = [];
      items.forEach(function (item) {
        cto.push(item.toCto());
      });
      if (totalItems)
        cto.totalItems = totalItems;
      return cto;
    }

    /**
     * Transforms the business object collection to a plain object array to send to the client.
     *
     * @function ReadOnlyRootCollection#toCto
     * @returns {Array.<object>} The client transfer object.
     */
    this.toCto = function () {
      if (extensions.toCto)
        return extensions.toCto.call(self, getTransferContext());
      else
        return baseToCto();
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

    //region Child methods

    function fetchChildren( data ) {
      return data instanceof Array ?
        Promise.all( data.map( dto => {
          return itemType.load( self, dto, eventHandlers );
        })) :
        Promise.resolve( [] );
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
          new DataPortalEventArgs(event, name, null, methodName, error)
      );
    }

    function wrapError (error) {
      return new DataPortalError(MODEL_DESC, name, DataPortalAction.fetch, error);
    }

    function runStatements (main, callback) {
      // Open connection.
      config.connectionManager.openConnection(
          extensions.dataSource, function (errOpen, connection) {
            if (errOpen)
              callback(wrapError(errOpen));
            else
              main(connection, function (err, result) {
                // Close connection.
                config.connectionManager.closeConnection(
                    extensions.dataSource, connection, function (errClose, connClosed) {
                      connection = connClosed;
                      if (err)
                        callback(wrapError(err));
                      else if (errClose)
                        callback(wrapError(errClose));
                      else
                        callback(null, result);
                    });
              });
          });
    }

    //endregion

    //region Fetch

    function data_fetch ( filter, method ) {
      return new Promise( (fulfill, reject) => {
        if (method === M_FETCH ? canDo( AuthorizationAction.fetchObject ) : canExecute( method )) {
          var connection = null;
          // Open connection.
          config.connectionManager.openConnection(extensions.dataSource)
            .then( dsc => {
              connection = dsc;
              // Launch start event.
              /**
               * The event arises before the collection instance will be retrieved from the repository.
               * @event ReadOnlyRootCollection#preFetch
               * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
               * @param {ReadOnlyRootCollection} oldObject - The collection instance before the data portal action.
               */
              raiseEvent( DataPortalEvent.preFetch, method );
              // Execute fetch.
              // Root element fetches all data from repository.
              return extensions.dataFetch ?
                // *** Custom fetch.
                extensions.$runMethod( 'fetch', self, getDataContext( connection ), filter, method ) :
                // *** Standard fetch.
                dao.$runMethod( method, connection, filter );
            })
            .then( dto => {
              // Get the count of all available items.
              if (dto.totalItems &&
                  (typeof dto.totalItems === 'number' || dto.totalItems instanceof Number) &&
                  dto.totalItems % 1 === 0)
                totalItems = dto.totalItems;
              else
                totalItems = null;
              // Load children.
              return fetchChildren( dto )
                .then( children => {
                  children.forEach( child => {
                    items.push( child );
                  });
                  return null;
                });
            })
            .then( none => {
              // Launch finish event.
              /**
               * The event arises after the collection instance has been retrieved from the repository.
               * @event ReadOnlyRootCollection#postFetch
               * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
               * @param {ReadOnlyRootCollection} newObject - The collection instance after the data portal action.
               */
              raiseEvent( DataPortalEvent.postFetch, method );
              // Close connection.
              config.connectionManager.closeConnection(extensions.dataSource, connection)
                .then( none => {
                  // Nothing to return.
                  fulfill( null );
                });
            })
            .catch( reason => {
              // Wrap the intercepted error.
              var dpe = wrapError( reason );
              // Launch finish event.
              raiseEvent( DataPortalEvent.postFetch, method, dpe );
              // Close connection.
              config.connectionManager.closeConnection( extensions.dataSource, connection )
                .then( none => {
                  // Pass the error.
                  reject( dpe );
                });
            });
        }
      });
    }

    //endregion

    //endregion

    //region Actions

    /**
     * Initializes a business object collection to be retrieved from the repository.
     * <br/>_This method is called by a factory method with the same name._
     *
     * @function ReadOnlyRootCollection#fetch
     * @protected
     * @param {*} [filter] - The filter criteria.
     * @param {string} [method] - An alternative fetch method of the data access object.
     * @returns {promise<ReadOnlyRootCollection>} Returns a promise to
     *      the required read-only collection.
     *
     * @throws {@link bo.system.ArgumentError Argument error}:
     *      The method must be a string or null.
     * @throws {@link bo.system.ArgumentError Argument error}:
     *      The callback must be a function.
     * @throws {@link bo.rules.AuthorizationError Authorization error}:
     *      The user has no permission to execute the action.
     * @throws {@link bo.shared.DataPortalError Data portal error}:
     *      Fetching the business object has failed.
     */
    this.fetch = function( filter, method ) {
      return new Promise( (fulfill, reject) => {
        method = Argument.inMethod( name, 'fetch' ).check( method ).forOptional( 'method' ).asString();

        data_fetch( filter, method || M_FETCH )
          .then( none => {
            fulfill( self );
          });
      });
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
     * @function ReadOnlyRootCollection#isValid
     * @returns {boolean} True when the business object is valid, otherwise false.
     */
    this.isValid = function() {
      return items.every(function (item) {
        return item.isValid();
      });
    };

    /**
     * Executes all the validation rules of all business objects in the collection,
     * including the ones of their child objects.
     *
     * _By default read-only business object collections are supposed to be valid._
     *
     * @function ReadOnlyRootCollection#checkRules
     */
    this.checkRules = function() {
      brokenRules.clear();

      items.forEach(function (item) {
        item.checkRules();
      });

      isValidated = true;
    };

    /**
     * Gets the broken rules of the business object collection.
     *
     * _By default read-only business object collections are supposed to be valid._
     *
     * @function ReadOnlyRootCollection#getBrokenRules
     * @param {string} [namespace] - The namespace of the message keys when messages are localizable.
     * @returns {bo.rules.BrokenRulesOutput} The broken rules of the business object collection.
     */
    this.getBrokenRules = function(namespace) {
      var bro = brokenRules.output(namespace);

      items.forEach(function (item) {
        var childBrokenRules = item.getBrokenRules(namespace);
        if (childBrokenRules)
          bro.addChild(property.name, childBrokenRules);
      });

      return bro.$length ? bro : null;
    };

    /**
     * Gets the response to send to the client in case of broken rules.
     *
     * _By default read-only business object collections are supposed to be valid._
     *
     * @function ReadOnlyRootCollection#getResponse
     * @param {string} [message] - Human-readable description of the reason of the failure.
     * @param {string} [namespace] - The namespace of the message keys when messages are localizable.
     * @returns {bo.rules.BrokenRulesResponse} The broken rules response to send to the client.
     */
    this.getResponse = function (message, namespace) {
      var output = this.getBrokenRules(namespace);
      return output ? new BrokenRulesResponse(output, message) : null;
    };

    //endregion

    //region Public array methods

    /**
     * Gets a collection item at a specific position.
     *
     * @function ReadOnlyRootCollection#at
     * @param {number} index - The index of the required item in the collection.
     * @returns {ReadOnlyChildObject} The required collection item.
     */
    this.at = function (index) {
      return items[index];
    };

    /**
     * Executes a provided function once per collection item.
     *
     * @function ReadOnlyRootCollection#forEach
     * @param {external.cbCollectionItem} callback - Function that produces an item of the new collection.
     */
    this.forEach = function (callback) {
      items.forEach(callback);
    };

    /**
     * Tests whether all items in the collection pass the test implemented by the provided function.
     *
     * @function ReadOnlyRootCollection#every
     * @param {external.cbCollectionItem} callback - Function to test for each collection item.
     * @returns {boolean} True when callback returns truthy value for each item, otherwise false.
     */
    this.every = function (callback) {
      return items.every(callback);
    };

    /**
     * Tests whether some item in the collection pass the test implemented by the provided function.
     *
     * @function ReadOnlyRootCollection#some
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
     * @function ReadOnlyRootCollection#filter
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
     * @function ReadOnlyRootCollection#map
     * @param {external.cbCollectionItem} callback - Function to test for each collection item.
     * @returns {Array.<*>} The new array of callback results.
     */
    this.map = function (callback) {
      return items.map(callback);
    };

    /**
     * Sorts the items of the collection in place and returns the collection.
     *
     * @function ReadOnlyRootCollection#sort
     * @param {external.cbCompare} [fnCompare] - Function that defines the sort order.
     *      If omitted, the collection is sorted according to each character's Unicode
     *      code point value, according to the string conversion of each item.
     * @returns {ReadOnlyRootCollection} The sorted collection.
     */
    this.sort = function (fnCompare) {
      return items.sort(fnCompare);
    };

    //endregion

    // Immutable object.
    Object.freeze(this);
  };
  util.inherits(ReadOnlyRootCollection, CollectionBase);

  /**
   * The name of the model type.
   *
   * @property {string} ReadOnlyRootCollection.constructor.modelType
   * @default ReadOnlyRootCollection
   * @readonly
   */
  Object.defineProperty(ReadOnlyRootCollection, 'modelType', {
    get: function () { return CLASS_NAME; }
  });

  //region Factory methods

  /**
   * Retrieves a read-only business object collection from the repository.
   *
   * @function ReadOnlyRootCollection.fetch
   * @param {*} [filter] - The filter criteria.
   * @param {string} [method] - An alternative fetch method of the data access object.
   * @param {bo.shared.EventHandlerList} [eventHandlers] - The event handlers of the instance.
   * @returns {promise<ReadOnlyRootCollection>} Returns a promise to
   *      the required read-only collection.
   *
   * @throws {@link bo.system.ArgumentError Argument error}:
   *      The method must be a string or null.
   * @throws {@link bo.system.ArgumentError Argument error}:
   *      The event handlers must be an EventHandlerList object or null.
   * @throws {@link bo.system.ArgumentError Argument error}:
   *      The callback must be a function.
   * @throws {@link bo.rules.AuthorizationError Authorization error}:
   *      The user has no permission to execute the action.
   * @throws {@link bo.shared.DataPortalError Data portal error}:
   *      Fetching the business object collection has failed.
   */
  ReadOnlyRootCollection.fetch = function( filter, method, eventHandlers ) {
    var instance = new ReadOnlyRootCollection( eventHandlers );
    return instance.fetch( filter, method );
  };

  //endregion

  return ReadOnlyRootCollection;
};

module.exports = ReadOnlyRootCollectionFactory;
