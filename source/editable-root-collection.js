'use strict';

//region Imports

var util = require('util');
var config = require('./system/configuration-reader.js');
var Argument = require('./system/argument-check.js');

var CollectionBase = require('./collection-base.js');
var ModelError = require('./shared/model-error.js');
var ExtensionManager = require('./shared/extension-manager.js');
var EventHandlerList = require('./shared/event-handler-list.js');
var DataStore = require('./shared/data-store.js');

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

var MODEL_STATE = require('./shared/model-state.js');
var CLASS_NAME = 'EditableRootCollection';
var MODEL_DESC = 'Editable root collection';
var M_FETCH = DataPortalAction.getName(DataPortalAction.fetch);

//endregion

/**
 * Factory method to create definitions of asynchronous editable root collections.
 *
 *    Valid collection item types are:
 *
 *      * EditableChildObject
 *
 * @function bo.EditableRootCollection
 * @param {string} name - The name of the collection.
 * @param {EditableChildObject} itemType - The model type of the collection items.
 * @param {bo.shared.RuleManager} rules - The authorization rules.
 * @param {bo.shared.ExtensionManager} extensions - The customization of the collection.
 * @returns {EditableRootCollection} The constructor of an asynchronous editable root collection.
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The collection name must be a non-empty string.
 * @throws {@link bo.system.ArgumentError Argument error}: The rules must be a RuleManager object.
 * @throws {@link bo.system.ArgumentError Argument error}: The extensions must be a ExtensionManager object.
 * @throws {@link bo.shared.ModelError Model error}: The item type must be an EditableChildObject.
 */
var EditableRootCollectionFactory = function (name, itemType, rules, extensions) {
  var check = Argument.inConstructor(CLASS_NAME);

  name = check(name).forMandatory('name').asString();
  rules = check(rules).forMandatory('rules').asType(RuleManager);
  extensions = check(extensions).forMandatory('extensions').asType(ExtensionManager);

  // Verify the model type of the item type.
  if (itemType.modelType !== 'EditableChildObject')
    throw new ModelError('invalidItem',
        itemType.prototype.name, itemType.modelType,
        CLASS_NAME, 'EditableChildObject');

  // Get data access object.
  var dao = extensions.getDataAccessObject(name);

  /**
   * @classdesc
   *    Represents the definition of an asynchronous editable root collection.
   * @description
   *    Creates a new asynchronous editable root collection instance.
   *
   *    _The name of the model type available as:
   *    __&lt;instance&gt;.constructor.modelType__, returns 'EditableRootCollection'._
   *
   * @name EditableRootCollection
   * @constructor
   * @param {bo.shared.EventHandlerList} [eventHandlers] - The event handlers of the instance.
   *
   * @extends CollectionBase
   *
   * @throws {@link bo.system.ArgumentError Argument error}:
   *    The event handlers must be an EventHandlerList object or null.
   *
   * @fires EditableRootCollection#preCreate
   * @fires EditableRootCollection#postCreate
   * @fires EditableRootCollection#preFetch
   * @fires EditableRootCollection#postFetch
   * @fires EditableRootCollection#preInsert
   * @fires EditableRootCollection#postInsert
   * @fires EditableRootCollection#preUpdate
   * @fires EditableRootCollection#postUpdate
   * @fires EditableRootCollection#preRemove
   * @fires EditableRootCollection#postRemove
   * @fires EditableRootCollection#preSave
   * @fires EditableRootCollection#postSave
   */
  var EditableRootCollection = function (eventHandlers) {
    CollectionBase.call(this);

    eventHandlers = Argument.inConstructor(name)
        .check(eventHandlers).forOptional('eventHandlers').asType(EventHandlerList);

    var self = this;
    var state = null;
    var isDirty = false;
    var items = [];
    var brokenRules = new BrokenRuleList(name);
    var isValidated = false;
    var dataContext = null;
    var connection = null;

    /**
     * The name of the model.
     *
     * @name EditableRootCollection#$modelName
     * @type {string}
     * @readonly
     */
    this.$modelName = name;

    /**
     * The count of the child objects in the collection.
     *
     * @name EditableRootCollection#count
     * @type {number}
     * @readonly
     */
    Object.defineProperty(self, 'count', {
      get: function () {
        return items.length;
      },
      enumerable: false
    });

    // Set up business rules.
    rules.initialize(config.noAccessBehavior);

    // Set up event handlers.
    if (eventHandlers)
      eventHandlers.setup(self);

    //region Mark object state

    /*
     * From:         To:  | pri | cre | cha | mfr | rem
     * -------------------------------------------------
     * NULL               |  +  |  +  |  N  |  N  |  N
     * -------------------------------------------------
     * pristine           |  o  |  -  |  +  |  +  |  -
     * -------------------------------------------------
     * created            |  +  |  o  |  o  | (-) |  +
     * -------------------------------------------------
     * changed            |  +  |  -  |  o  |  +  |  -
     * -------------------------------------------------
     * markedForRemoval   |  -  |  -  |  o  |  o  |  +
     * -------------------------------------------------
     * removed            |  -  |  -  |  -  |  -  |  o
     * -------------------------------------------------
     *
     * Explanation:
     *   +  :  possible transition
     *   -  :  not allowed transition, throws exception
     *   o  :  no change, no action
     *   N  :  impossible start up, throws exception
     */

    function markAsPristine() {
      if (state === MODEL_STATE.markedForRemoval || state === MODEL_STATE.removed)
        illegal(MODEL_STATE.pristine);
      else if (state !== MODEL_STATE.pristine) {
        state = MODEL_STATE.pristine;
        isDirty = false;
      }
    }

    function markAsCreated() {
      if (state === null) {
        state = MODEL_STATE.created;
        isDirty = true;
      }
      else if (state !== MODEL_STATE.created)
        illegal(MODEL_STATE.created);
    }

    function markAsChanged(itself) {
      if (state === MODEL_STATE.pristine) {
        state = MODEL_STATE.changed;
        isDirty = isDirty || itself;
        isValidated = false;
      }
      else if (state === MODEL_STATE.created) {
        isDirty = isDirty || itself;
        isValidated = false;
      }
      else if (state === MODEL_STATE.removed)
        illegal(MODEL_STATE.changed);
    }

    function markForRemoval() {
      if (state === MODEL_STATE.pristine || state === MODEL_STATE.changed) {
        state = MODEL_STATE.markedForRemoval;
        isDirty = true;
        propagateRemoval(); // down to children
      }
      else if (state === MODEL_STATE.created)
        state = MODEL_STATE.removed;
      else if (state !== MODEL_STATE.markedForRemoval)
        illegal(MODEL_STATE.markedForRemoval);
    }

    function markAsRemoved() {
      if (state === MODEL_STATE.created || state === MODEL_STATE.markedForRemoval) {
        state = MODEL_STATE.removed;
        isDirty = false;
      }
      else if (state !== MODEL_STATE.removed)
        illegal(MODEL_STATE.removed);
    }

    function illegal(newState) {
      throw new ModelError('transition',
          (state == null ? 'NULL' : MODEL_STATE.getName(state)),
          MODEL_STATE.getName(newState));
    }

    /**
     * Notes that a child object has changed.
     * <br/>_This method is called by child objects._
     *
     * @function EditableRootCollection#childHasChanged
     * @protected
     */
    this.childHasChanged = function() {
      markAsChanged(false);
    };

    function propagateRemoval() {
      items.forEach(function(child) {
        child.remove();
      });
    }

    //endregion

    //region Show object state

    /**
     * Gets the state of the collection. Valid states are:
     * pristine, created, changed, markedForRemoval and removed.
     *
     * @function EditableRootCollection#getModelState
     * @returns {string} The state of the collection.
     */
    this.getModelState = function () {
      return MODEL_STATE.getName(state);
    };

    /**
     * Indicates whether the business object collection has been created newly
     * and not has been yet saved, i.e. its state is created.
     *
     * @function EditableRootCollection#isNew
     * @returns {boolean} True when the business object collection is new, otherwise false.
     */
    this.isNew = function () {
      return state === MODEL_STATE.created;
    };

    /**
     * Indicates whether the business object collection itself or any of its child objects differs the
     * one that is stored in the repository, i.e. its state is created, changed or markedForRemoval.
     *
     * @function EditableRootCollection#isDirty
     * @returns {boolean} True when the business object collection has been changed, otherwise false.
     */
    this.isDirty = function () {
      return state === MODEL_STATE.created ||
          state === MODEL_STATE.changed ||
          state === MODEL_STATE.markedForRemoval;
    };

    /**
     * Indicates whether the business object collection itself, ignoring its child objects,
     * differs the one that is stored in the repository.
     *
     * @function EditableRootCollection#isSelfDirty
     * @returns {boolean} True when the business object collection itself has been changed, otherwise false.
     */
    this.isSelfDirty = function () {
      return isDirty;
    };

    /**
     * Indicates whether the business object collection will be deleted from the repository,
     * i.e. its state is markedForRemoval.
     *
     * @function EditableRootCollection#isDeleted
     * @returns {boolean} True when the business object collection will be deleted, otherwise false.
     */
    this.isDeleted = function () {
      return state === MODEL_STATE.markedForRemoval;
    };

    /**
     * Indicates whether the business object collection can be saved to the repository,
     * i.e. it has ben changed and is valid, and the user has permission to save it.
     *
     * @function EditableRootCollection#isSavable
     * @returns {boolean} True when the user can save the business object collection, otherwise false.
     */
    this.isSavable = function () {
      var auth;
      if (self.isDeleted)
        auth = canDo(AuthorizationAction.removeObject);
      else if (self.isNew)
        auth = canDo(AuthorizationAction.createObject);
      else
        auth = canDo(AuthorizationAction.updateObject);
      return auth && self.isDirty && self.isValid();
    };

    //endregion

    //region Transfer object methods

    function getTransferContext (authorize) {
      return new TransferContext(null, null, null);
    }

    function baseToCto() {
      var cto = [];
      items.forEach(function (item) {
        cto.push(item.toCto());
      });
      return cto;
    }

    /**
     * Transforms the business object collection to a plain object array to send to the client.
     *
     * @function EditableRootCollection#toCto
     * @returns {object} The client transfer object.
     */
    this.toCto = function () {
      if (extensions.toCto)
        return extensions.toCto.call(self, getTransferContext());
      else
        return baseToCto();
    };

    function baseFromCto(data) {
      // Nothing to do.
    }

    /**
     * Rebuilds the business object collection from a plain object array sent by the client.
     *
     * @function EditableRootCollection#fromCto
     * @param {object[]} cto - The client transfer object.
     * @returns {Promise.<EditableRootCollection>} Returns a promise to the editable root collection rebuilt.
     */
    this.fromCto = function( cto ) {
      return new Promise( (fulfill, reject) => {
        if (extensions.fromCto)
          extensions.fromCto.call( self, getTransferContext( true ), cto );
        else
          baseFromCto( cto );

        if (cto instanceof Array) {
          var ctoNew = cto.filter( d => { return true; }); // Deep copy.
          var itemsLive = [];
          var itemsLate = [];
          var index;

          // Discover changed items.
          for (index = 0; index < items.length; index++) {
            var dataFound = false;
            var i = 0;
            for (; i < ctoNew.length; i++) {
              if (items[ index ].keyEquals( cto[i] )) {
                itemsLive.push( { item: index, cto: i } );
                dataFound = true;
                break;
              }
            }
            dataFound ?
              ctoNew.splice(i, 1) :
              itemsLate.push(index);
          }
          // Update existing items.
          Promise.all( itemsLive.map( live => {
            return items[ live.item ].fromCto( cto[ live.cto ] );
          }))
            .then( values => {
              // Remove non existing items.
              for (index = 0; index < itemsLate.length; index++) {
                items[ itemsLate[ index ]].remove();
              }
              // Insert non existing items.
              Promise.all( ctoNew.map( cto => {
                return itemType.create( self, eventHandlers )
              }))
                .then( newItems => {
                  items.push.apply( items, newItems );
                  Promise.all( newItems.map( (newItem, i) => {
                    return newItem.fromCto( ctoNew[i] );
                  }))
                    .then( values => {
                      // Finished.
                      fulfill( self );
                    })
                });
            });
        } else
          // Nothing to do.
          fulfill( self );
      });
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
      return data instanceof Array && data.length ?
        Promise.all( data.map( dto => {
          return itemType.load( self, dto, eventHandlers )
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
    }

    function saveChildren( connection ) {
      return Promise.all( items.map( item => {
        return item.save( connection );
      }));
    }

    function childrenAreValid () {
      return items.every(function (item) {
        return item.isValid();
      });
    }

    function checkChildRules () {
      items.forEach(function (item) {
        item.checkRules();
      });
    }

    //endregion

    //region Data portal methods

    //region Helper

    function getDataContext( connection ) {
      if (!dataContext)
        dataContext = new DataPortalContext( dao );
      return dataContext.setState( connection, false );
    }

    function raiseEvent( event, methodName, error ) {
      self.emit(
          DataPortalEvent.getName( event ),
          new DataPortalEventArgs( event, name, null, methodName, error )
      );
    }

    function raiseSave( event, action, error ) {
      self.emit(
          DataPortalEvent.getName( event ),
          new DataPortalEventArgs( event, name, action, null, error )
      );
    }

    function wrapError( error ) {
      return new DataPortalError( MODEL_DESC, name, DataPortalAction.fetch, error );
    }

    //endregion

    //region Create

    function data_create() {
      return new Promise( (fulfill, reject) => {

        //var connection = null;
        //// Open connection.
        //config.connectionManager.openConnection( extensions.dataSource )
        //  .then( dsc => {
        //    connection = dsc;
        //    // Launch start event.
        //    /**
        //     * The event arises before the business object collection will be initialized in the repository.
        //     * @event EditableRootCollection#preCreate
        //     * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
        //     * @param {EditableRootCollection} oldObject - The instance of the collection before the data portal action.
        //     */
        //    raiseEvent( DataPortalEvent.preCreate );
        //    // Execute creation - nothing to do.
        //    markAsCreated();
        //    // Launch finish event.
        //    /**
        //     * The event arises after the business object collection has been initialized in the repository.
        //     * @event EditableRootCollection#postCreate
        //     * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
        //     * @param {EditableRootCollection} newObject - The instance of the collection after the data portal action.
        //     */
        //    raiseEvent( DataPortalEvent.postCreate );
        //    // Close connection.
        //    return config.connectionManager.closeConnection( extensions.dataSource, connection )
        //      .then( none => {
        //        // Return the new editable root collection.
        //        fulfill( self );
        //      });
        //  })
        //  .catch( reason => {
        //    // Wrap the intercepted error.
        //    var dpe = wrapError( DataPortalAction.create, reason );
        //    // Launch finish event.
        //    if (connection)
        //      raiseEvent( DataPortalEvent.postCreate, null, dpe );
        //    // Close connection.
        //    config.connectionManager.closeConnection( extensions.dataSource, connection )
        //      .then( none => {
        //        // Pass the error.
        //        reject( dpe );
        //      });
        //  });

        // Launch start event.
        /**
         * The event arises before the business object collection will be initialized in the repository.
         * @event EditableRootCollection#preCreate
         * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
         * @param {EditableRootCollection} oldObject - The instance of the collection before the data portal action.
         */
        raiseEvent( DataPortalEvent.preCreate );
        // Execute creation - nothing to do.
        markAsCreated();
        // Launch finish event.
        /**
         * The event arises after the business object collection has been initialized in the repository.
         * @event EditableRootCollection#postCreate
         * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
         * @param {EditableRootCollection} newObject - The instance of the collection after the data portal action.
         */
        raiseEvent( DataPortalEvent.postCreate );
        // Return the new editable root collection.
        fulfill( self );
      });
    }

    //endregion

    //region Fetch

    function data_fetch( filter, method ) {
      return new Promise( (fulfill, reject) => {
        // Check permissions.
        if (method === M_FETCH ? canDo( AuthorizationAction.fetchObject ) : canExecute( method )) {
          var connection = null;
          // Open connection.
          config.connectionManager.openConnection( extensions.dataSource )
            .then( dsc => {
              connection = dsc;
              // Launch start event.
              /**
               * The event arises before the collection instance will be retrieved from the repository.
               * @event EditableRootCollection#preFetch
               * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
               * @param {EditableRootCollection} oldObject - The collection instance before the data portal action.
               */
              raiseEvent( DataPortalEvent.preFetch, method );
              // Execute fetch.
              return extensions.dataFetch ?
                // *** Custom fetch.
                extensions.$runMethod( 'fetch', self, getDataContext( connection ), filter, method ) :
                // *** Standard fetch.
                // Root element fetches all data from repository.
                dao.$runMethod( method, connection, filter );
            })
            .then( dto => {
              // Load children.
              return fetchChildren( dto );
            })
            .then( none => {
              markAsPristine();
              // Launch finish event.
              /**
               * The event arises after the collection instance has been retrieved from the repository.
               * @event EditableRootCollection#postFetch
               * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
               * @param {EditableRootCollection} newObject - The collection instance after the data portal action.
               */
              raiseEvent( DataPortalEvent.postFetch, method );
              // Close connection.
              config.connectionManager.closeConnection( extensions.dataSource, connection )
                .then( none => {
                  // Return the fetched editable root collection.
                  fulfill( self );
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
                  // Paa the error.
                  reject( dpe );
                });
            });
        }
      });
    }

    //endregion

    //region Insert

    function data_insert() {
      return new Promise( (fulfill, reject) => {
        // Check permissions.
        if (canDo( AuthorizationAction.createObject )) {
          var connection = null;
          // Start transaction.
          config.connectionManager.beginTransaction( extensions.dataSource )
            .then( dsc => {
              connection = dsc;
              // Launch start event.
              raiseSave( DataPortalEvent.preSave, DataPortalAction.insert );
              /**
               * The event arises before the business object collection will be created in the repository.
               * @event EditableRootCollection#preInsert
               * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
               * @param {EditableRootCollection} oldObject - The instance of the collection before the data portal action.
               */
              raiseEvent( DataPortalEvent.preInsert );
              // Execute insert - nothing to do.
              // Insert children as well.
              return saveChildren( connection );
            })
            .then( none => {
              markAsPristine();
              // Launch finish event.
              /**
               * The event arises after the business object collection has been created in the repository.
               * @event EditableRootCollection#postInsert
               * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
               * @param {EditableRootCollection} newObject - The instance of the collection after the data portal action.
               */
              raiseEvent( DataPortalEvent.postInsert );
              raiseSave( DataPortalEvent.postSave, DataPortalAction.insert );
              // Finish transaction.
              return config.connectionManager.commitTransaction( extensions.dataSource, connection )
                .then( none => {
                  // Return the created editable root collection.
                  fulfill( self );
                });
            })
            .catch( reason => {
              // Wrap the intercepted error.
              var dpe = wrapError( DataPortalAction.insert, reason );
              // Launch finish event.
              if (connection) {
                raiseEvent( DataPortalEvent.postInsert, null, dpe );
                raiseSave( DataPortalEvent.postSave, DataPortalAction.insert, dpe );
              }
              // Undo transaction.
              config.connectionManager.rollbackTransaction( extensions.dataSource, connection )
                .then( none => {
                  // Pass the error.
                  reject( dpe );
                });
            });
        }
      });
    }

    //endregion

    //region Update

    function data_update() {
      return new Promise( (fulfill, reject) => {
        // Check permissions.
        if (canDo( AuthorizationAction.updateObject )) {
          var connection = null;
          // Start transaction.
          config.connectionManager.beginTransaction(extensions.dataSource)
            .then(dsc => {
              connection = dsc;
              // Launch start event.
              raiseSave( DataPortalEvent.preSave, DataPortalAction.update );
              /**
               * The event arises before the business object collection will be updated in the repository.
               * @event EditableRootCollection#preUpdate
               * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
               * @param {EditableRootCollection} oldObject - The instance of the collection before the data portal action.
               */
              raiseEvent( DataPortalEvent.preUpdate );
              // Execute update - nothing to do.
              // Update children as well.
              return saveChildren( connection );
            })
            .then( none => {
              markAsPristine();
              // Launch finish event.
              /**
               * The event arises after the business object collection has been updated in the repository.
               * @event EditableRootCollection#postUpdate
               * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
               * @param {EditableRootCollection} newObject - The instance of the collection after the data portal action.
               */
              raiseEvent( DataPortalEvent.postUpdate );
              raiseSave( DataPortalEvent.postSave, DataPortalAction.update );
              // Finish transaction.
              config.connectionManager.commitTransaction( extensions.dataSource, connection )
                .then( none => {
                  // Return the updated editable root collection.
                  fulfill( self );
                });
            })
            .catch( reason => {
              // Wrap the intercepted error.
              var dpe = wrapError( DataPortalAction.update, reason );
              // Launch finish event.
              if (connection) {
                raiseEvent( DataPortalEvent.postUpdate, null, dpe );
                raiseSave( DataPortalEvent.postSave, DataPortalAction.update, dpe );
              }
              // Undo transaction.
              config.connectionManager.rollbackTransaction( extensions.dataSource, connection )
                .then( none => {
                  // Pass the error.
                  reject( dpe );
                });
            });
        }
      });
    }

    //endregion

    //region Remove

    function data_remove () {
      return new Promise( (fulfill, reject) => {
        // Check permissions.
        if (canDo( AuthorizationAction.removeObject )) {
          var connection = null;
          // Start transaction.
          config.connectionManager.beginTransaction( extensions.dataSource )
            .then( dsc => {
              connection = dsc;
              // Launch start event.
              raiseSave( DataPortalEvent.preSave, DataPortalAction.remove );
              /**
               * The event arises before the business object collection will be removed from the repository.
               * @event EditableRootCollection#preRemove
               * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
               * @param {EditableRootCollection} oldObject - The instance of the collection before the data portal action.
               */
              raiseEvent( DataPortalEvent.preRemove );
              // Remove children first.
              return saveChildren( connection );
            })
            .then( none => {
              // Execute removal - nothing to do.
              markAsRemoved();
              // Launch finish event.
              /**
               * The event arises after the business object collection has been removed from the repository.
               * @event EditableRootCollection#postRemove
               * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
               * @param {EditableRootCollection} newObject - The instance of the collection after the data portal action.
               */
              raiseEvent( DataPortalEvent.postRemove );
              raiseSave( DataPortalEvent.postSave, DataPortalAction.remove );
              // Finish transaction.
              config.connectionManager.commitTransaction( extensions.dataSource, connection )
                .then( none => {
                  // Nothing to return;
                  fulfill( null );
                });
            })
            .catch( reason => {
              // Wrap the intercepted error.
              var dpe = wrapError( DataPortalAction.remove, reason );
              // Launch finish event.
              if (connection) {
                raiseEvent( DataPortalEvent.postRemove, null, dpe );
                raiseSave( DataPortalEvent.postSave, DataPortalAction.remove, dpe );
              }
              // Undo transaction.
              config.connectionManager.rollbackTransaction( extensions.dataSource, connection )
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
     * Initializes a newly created business object collection.
     * <br/>_This method is called by a factory method with the same name._
     *
     * @function EditableRootCollection#create
     * @protected
     * @returns {Promise.<EditableRootCollection>} Returns a promise to the new editable root collection.
     *
     * @throws {@link bo.system.ArgumentError Argument error}:
     *      The callback must be a function.
     * @throws {@link bo.rules.AuthorizationError Authorization error}:
     *      The user has no permission to execute the action.
     * @throws {@link bo.shared.DataPortalError Data portal error}:
     *      Creating the business object collection has failed.
     */
    this.create = function() {
      return data_create();
    };

    /**
     * Creates a new item and adds it to the collection at the specified index.
     *
     * @function EditableRootCollection#create
     * @param {number} [index] - The index of the new item.
     * @returns {Promise.<EditableChildObject>} Returns a promise to the editable child object created.
     */
    this.createItem = function( index ) {
      return itemType.create( self, eventHandlers )
        .then( item => {
          var ix = parseInt( index, 10 );
          ix = isNaN( ix ) ? items.length : ix;
          items.splice( ix, 0, item );
          return item;
        });
    };

    /**
     * Initializes a business object collection to be retrieved from the repository.
     * <br/>_This method is called by a factory method with the same name._
     *
     * @function EditableRootCollection#fetch
     * @protected
     * @param {*} [filter] - The filter criteria.
     * @param {string} [method] - An alternative fetch method of the data access object.
     * @returns {Promise.<EditableRootCollection>} Returns a promise to the retrieved editable root collection.
     *
     * @throws {@link bo.system.ArgumentError Argument error}:
     *      The method must be a string or null.
     * @throws {@link bo.system.ArgumentError Argument error}:
     *      The callback must be a function.
     * @throws {@link bo.rules.AuthorizationError Authorization error}:
     *      The user has no permission to execute the action.
     * @throws {@link bo.shared.DataPortalError Data portal error}:
     *      Fetching the business object collection has failed.
     */
    this.fetch = function( filter, method ) {
      method = Argument.inMethod( name, 'fetch' ).check( method ).forOptional( 'method' ).asString();
      return data_fetch( filter, method || M_FETCH );
    };

    /**
     * Saves the changes of the business object collection to the repository.
     *
     * @function EditableRootCollection#save
     * @return {Promise.<EditableRootCollection>} Returns a promise to the saved editable root collection.
     *
     * @throws {@link bo.system.ArgumentError Argument error}:
     *      The callback must be a function.
     * @throws {@link bo.rules.AuthorizationError Authorization error}:
     *      The user has no permission to execute the action.
     * @throws {@link bo.shared.DataPortalError Data portal error}:
     *      Inserting the business object collection has failed.
     * @throws {@link bo.shared.DataPortalError Data portal error}:
     *      Updating the business object collection has failed.
     * @throws {@link bo.shared.DataPortalError Data portal error}:
     *      Deleting the business object collection has failed.
     */
    this.save = function() {
      return new Promise( (fulfill, reject) => {

        function expelRemovedItems() {
          items = items.filter( item => {
            return item.getModelState() !== MODEL_STATE.getName( MODEL_STATE.removed );
          });
        }
        if (self.isValid()) {
          /**
           * The event arises before the business object collection will be saved in the repository.
           * The event is followed by a preInsert, preUpdate or preRemove event depending on the
           * state of the business object collection.
           * @event EditableRootCollection#preSave
           * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
           * @param {EditableRootCollection} oldObject - The instance of the collection before the data portal action.
           */
          switch (state) {
            case MODEL_STATE.created:
              data_insert()
                .then( inserted => {
                  fulfill( inserted );
                });
              break;
            case MODEL_STATE.changed:
              data_update()
                .then( updated => {
                  expelRemovedItems();
                  fulfill( updated );
                });
              break;
            case MODEL_STATE.markedForRemoval:
              data_remove()
                .then( removed => {
                  expelRemovedItems();
                  fulfill( removed );
                });
              break;
            default:
              fulfill( self );
          }
          /**
           * The event arises after the business object collection has been saved in the repository.
           * The event is preceded by a postInsert, postUpdate or postRemove event depending on the
           * state of the business object collection.
           * @event EditableRootCollection#postSave
           * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
           * @param {EditableRootCollection} newObject - The instance of the collection after the data portal action.
           */
        }
      });
    };

    /**
     * Marks the business object collection to be deleted from the repository on next save.
     *
     * @function EditableRootCollection#remove
     */
    this.remove = function() {
      markForRemoval();
    };

    //endregion

    //region Validation

    /**
     * Indicates whether all validation rules of all business objects of the
     * collection succeeds. A valid business object collection may have
     * broken rules with severity of success, information and warning.
     *
     * @function EditableRootCollection#isValid
     * @returns {boolean} True when the business object collection is valid, otherwise false.
     */
    this.isValid = function () {
      if (!isValidated)
        this.checkRules();

      return brokenRules.isValid() && childrenAreValid();
    };

    /**
     * Executes all the validation rules of the business object, including the ones
     * of its child objects.
     *
     * @function EditableRootCollection#checkRules
     */
    this.checkRules = function () {
      brokenRules.clear();

      checkChildRules();

      isValidated = true;
    };

    /**
     * Gets the broken rules of the business object.
     *
     * @function EditableRootCollection#getBrokenRules
     * @param {string} [namespace] - The namespace of the message keys when messages are localizable.
     * @returns {bo.rules.BrokenRulesOutput} The broken rules of the business object.
     */
    this.getBrokenRules = function (namespace) {
      var bro = brokenRules.output(namespace);

      items.forEach(function (item) {
        var childBrokenRules = item.getBrokenRules(namespace);
        if (childBrokenRules)
          bro.addChild(name, childBrokenRules);
      });

      return bro.$length ? bro : null;
    };

    /**
     * Gets the response to send to the client in case of broken rules.
     *
     * @function EditableRootCollection#getResponse
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
     * @function EditableRootCollection#at
     * @param {number} index - The index of the required item in the collection.
     * @returns {EditableChildObject} The required collection item.
     */
    this.at = function (index) {
      return items[index];
    };

    /**
     * Executes a provided function once per collection item.
     *
     * @function EditableRootCollection#forEach
     * @param {external.cbCollectionItem} callback - Function that produces an item of the new collection.
     */
    this.forEach = function (callback) {
      items.forEach(callback);
    };

    /**
     * Tests whether all items in the collection pass the test implemented by the provided function.
     *
     * @function EditableRootCollection#every
     * @param {external.cbCollectionItem} callback - Function to test for each collection item.
     * @returns {boolean} True when callback returns truthy value for each item, otherwise false.
     */
    this.every = function (callback) {
      return items.every(callback);
    };

    /**
     * Tests whether some item in the collection pass the test implemented by the provided function.
     *
     * @function EditableRootCollection#some
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
     * @function EditableRootCollection#filter
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
     * @function EditableRootCollection#map
     * @param {external.cbCollectionItem} callback - Function to test for each collection item.
     * @returns {Array.<*>} The new array of callback results.
     */
    this.map = function (callback) {
      return items.map(callback);
    };

    /**
     * Sorts the items of the collection in place and returns the collection.
     *
     * @function EditableRootCollection#sort
     * @param {external.cbCompare} [fnCompare] - Function that defines the sort order.
     *      If omitted, the collection is sorted according to each character's Unicode
     *      code point value, according to the string conversion of each item.
     * @returns {Array.<EditableChildObject>} The sorted collection.
     */
    this.sort = function (fnCompare) {
      return items.sort(fnCompare);
    };

    //endregion

    // Immutable object.
    Object.freeze(this);
  };
  util.inherits(EditableRootCollection, CollectionBase);

  /**
   * The name of the model type.
   *
   * @property {string} EditableRootCollection.constructor.modelType
   * @default EditableRootCollection
   * @readonly
   */
  Object.defineProperty(EditableRootCollection, 'modelType', {
    get: function () { return CLASS_NAME; }
  });

  //region Factory methods

  /**
   * Creates a new editable business object collection.
   *
   * @function EditableRootCollection.create
   * @param {bo.shared.EventHandlerList} [eventHandlers] - The event handlers of the instance.
   * @returns {Promise.<EditableRootCollection>} Returns a promise to the new editable root collection.
   *
   * @throws {@link bo.system.ArgumentError Argument error}:
   *      The event handlers must be an EventHandlerList object or null.
   * @throws {@link bo.rules.AuthorizationError Authorization error}:
   *      The user has no permission to execute the action.
   * @throws {@link bo.shared.DataPortalError Data portal error}:
   *      Creating the business object collection has failed.
   */
  EditableRootCollection.create = function( eventHandlers ) {
    var instance = new EditableRootCollection( eventHandlers );
    return instance.create();
  };

  /**
   * Retrieves an editable business object collection from the repository.
   *
   * @function EditableRootCollection.fetch
   * @param {*} [filter] - The filter criteria.
   * @param {string} [method] - An alternative fetch method of the data access object.
   * @param {bo.shared.EventHandlerList} [eventHandlers] - The event handlers of the instance.
   * @returns {Promise.<EditableRootCollection>} Returns a promise to the retrieved editable root collection.
   *
   * @throws {@link bo.system.ArgumentError Argument error}:
   *      The method must be a string or null.
   * @throws {@link bo.system.ArgumentError Argument error}:
   *      The event handlers must be an EventHandlerList object or null.
   * @throws {@link bo.rules.AuthorizationError Authorization error}:
   *      The user has no permission to execute the action.
   * @throws {@link bo.shared.DataPortalError Data portal error}:
   *      Fetching the business object collection has failed.
   */
  EditableRootCollection.fetch = function( filter, method, eventHandlers ) {
    var instance = new EditableRootCollection( eventHandlers );
    return instance.fetch( filter, method );
  };

  //endregion

  return EditableRootCollection;
};

module.exports = EditableRootCollectionFactory;
