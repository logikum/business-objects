'use strict';

//region Imports

var util = require('util');
var config = require('./shared/configuration-reader.js');
var EnsureArgument = require('./system/ensure-argument.js');

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
 *      * EditableChildModel
 *
 * @function bo.EditableRootCollection
 * @param {string} name - The name of the collection.
 * @param {EditableChildModel} itemType - The model type of the collection items.
 * @param {bo.shared.RuleManager} rules - The authorization rules.
 * @param {bo.shared.ExtensionManager} extensions - The customization of the collection.
 * @returns {EditableRootCollection} The constructor of an asynchronous editable root collection.
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The collection name must be a non-empty string.
 * @throws {@link bo.system.ArgumentError Argument error}: The rules must be a RuleManager object.
 * @throws {@link bo.system.ArgumentError Argument error}: The extensions must be a ExtensionManager object.
 * @throws {@link bo.shared.ModelError Model error}: The item type must be an EditableChildModel.
 */
var EditableRootCollectionFactory = function (name, itemType, rules, extensions) {

  name = EnsureArgument.isMandatoryString(name,
      'c_manString', CLASS_NAME, 'name');
  rules = EnsureArgument.isMandatoryType(rules, RuleManager,
      'c_manType', CLASS_NAME, 'rules');
  extensions = EnsureArgument.isMandatoryType(extensions, ExtensionManager,
      'c_manType', CLASS_NAME, 'extensions');

  // Verify the model type of the item type.
  if (itemType.modelType !== 'EditableChildModel')
    throw new ModelError('invalidItem',
        itemType.prototype.name, itemType.modelType,
        CLASS_NAME, 'EditableChildModel');

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

    eventHandlers = EnsureArgument.isOptionalType(eventHandlers, EventHandlerList,
        'c_optType', name, 'eventHandlers');

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
      if (data instanceof Array) {
        var dataNew = data.filter(function () { return true; });
        var itemsLate = [];
        var index, cto;
        // Update existing items.
        for (index = 0; index < items.length; index++) {
          var item = items[index];
          var dataFound = false;
          var i = 0;
          for (; i < dataNew.length; i++) {
            cto = data[i];
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
        }
        // Remove non existing items.
        for (index = 0; index < itemsLate.length; index++) {
          items[itemsLate[index]].remove();
        }
        // Insert non existing data.
        for (index = 0; index < dataNew.length; index++) {
          cto = dataNew[index];
          var newItem = itemType.create(self, eventHandlers);
          newItem.fromCto(cto);
          items.push(newItem);
        }
      }
    }

    /**
     * Rebuilds the business object collection from a plain object array sent by the client.
     *
     * @function EditableRootCollection#fromCto
     * @param {object} cto - The client transfer object.
     */
    this.fromCto = function (cto) {
      if (extensions.fromCto)
        extensions.fromCto.call(self, getTransferContext(true), cto);
      else
        baseFromCto(cto);
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

    function fetchChildren (dto) {
      if (dto instanceof Array) {
        dto.forEach(function (data) {
          var item = itemType.load(self, data, eventHandlers);
          items.push(item);
        });
      }
    }

    function insertChildren(connection, callback) {
      saveChildren(connection, callback);
    }

    function updateChildren(connection, callback) {
      saveChildren(connection, callback);
    }

    function removeChildren(connection, callback) {
      saveChildren(connection, callback);
    }

    function saveChildren(connection, callback) {
      var count = 0;
      var error = null;

      if (items.length) {
        items.forEach(function (item) {
          item.save(connection, function (err) {
            error = error || err;
            // Check if all items are done.
            if (++count === items.length) {
              callback(error);
            }
          });
        });
      } else
        callback(null);
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

    function raiseSave (event, action, error) {
      self.emit(
          DataPortalEvent.getName(event),
          new DataPortalEventArgs(event, name, action, null, error)
      );
    }

    function wrapError (error) {
      return new DataPortalError(MODEL_DESC, name, DataPortalAction.fetch, error);
    }

    function runStatements (main, action, callback) {
      // Open connection.
      config.connectionManager.openConnection(
          extensions.dataSource, function (errOpen, connection) {
            if (errOpen)
              callback(wrapError(action, errOpen));
            else
              main(connection, function (err, result) {
                // Close connection.
                config.connectionManager.closeConnection(
                    extensions.dataSource, connection, function (errClose, connClosed) {
                      connection = connClosed;
                      if (err)
                        callback(wrapError(action, err));
                      else if (errClose)
                        callback(wrapError(action, errClose));
                      else
                        callback(null, result);
                    });
              });
          });
    }

    function runTransaction (main, action, callback) {
      // Start transaction.
      config.connectionManager.beginTransaction(
          extensions.dataSource, function (errBegin, connection) {
            if (errBegin)
              callback(wrapError(action, errBegin));
            else
              main(connection, function (err, result) {
                if (err)
                // Undo transaction.
                  config.connectionManager.rollbackTransaction(
                      extensions.dataSource, connection, function (errRollback, connClosed) {
                        connection = connClosed;
                        callback(wrapError(action, err));
                      });
                else
                // Finish transaction.
                  config.connectionManager.commitTransaction(
                      extensions.dataSource, connection, function (errCommit, connClosed) {
                        connection = connClosed;
                        if (errCommit)
                          callback(wrapError(action, errCommit));
                        else
                          callback(null, result);
                      });
              });
          });
    }

    //endregion

    //region Create

    function data_create (callback) {
      var hasConnection = false;
      // Helper callback for post-creation actions.
      function finish (cb) {
        markAsCreated();
        // Launch finish event.
        /**
         * The event arises after the business object collection has been initialized in the repository.
         * @event EditableRootCollection#postCreate
         * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
         * @param {EditableRootCollection} newObject - The instance of the collection after the data portal action.
         */
        raiseEvent(DataPortalEvent.postCreate);
        cb(null, self);
      }
      // Main activity.
      function main (connection, cb) {
        hasConnection = connection !== null;
        // Launch start event.
        /**
         * The event arises before the business object collection will be initialized in the repository.
         * @event EditableRootCollection#preCreate
         * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
         * @param {EditableRootCollection} oldObject - The instance of the collection before the data portal action.
         */
        raiseEvent(DataPortalEvent.preCreate);
        // Execute creation - nothing to do.
        finish(cb);
      }
      runStatements(main, DataPortalAction.create, callback);
    }

    //endregion

    //region Fetch

    function data_fetch (filter, method, callback) {
      var hasConnection = false;
      // Helper function for post-fetch actions.
      function finish (dto, cb) {
        // Load children.
        fetchChildren(dto);
        markAsPristine();
        // Launch finish event.
        /**
         * The event arises after the collection instance has been retrieved from the repository.
         * @event EditableRootCollection#postFetch
         * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
         * @param {EditableRootCollection} newObject - The collection instance after the data portal action.
         */
        raiseEvent(DataPortalEvent.postFetch, method);
        cb(null, self);
      }
      // Helper callback for failure.
      function failed (err, cb) {
        if (hasConnection) {
          // Launch finish event.
          var dpError = wrapError(DataPortalAction.fetch, err);
          raiseEvent(DataPortalEvent.postFetch, method, dpError);
        }
        cb(err);
      }
      // Main activity.
      function main (connection, cb) {
        hasConnection = connection !== null;
        // Launch start event.
        /**
         * The event arises before the collection instance will be retrieved from the repository.
         * @event EditableRootCollection#preFetch
         * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
         * @param {EditableRootCollection} oldObject - The collection instance before the data portal action.
         */
        raiseEvent(DataPortalEvent.preFetch, method);
        // Execute fetch.
        if (extensions.dataFetch) {
          // *** Custom fetch.
          extensions.dataFetch.call(self, getDataContext(connection), filter, method, function (err, dto) {
            if (err)
              failed(err, cb);
            else
              finish(dto, cb);
          });
        } else {
          // *** Standard fetch.
          // Root element fetches data from repository.
          dao.$runMethod(method, connection, filter, function (err, dto) {
            if (err)
              failed(err, cb);
            else {
              finish(dto, cb);
            }
          });
        }
      }
      // Check permissions.
      if (method === M_FETCH ? canDo(AuthorizationAction.fetchObject) : canExecute(method))
        runStatements(main, DataPortalAction.fetch, callback);
      else
        callback(null, self);
    }

    //endregion

    //region Insert

    function data_insert (callback) {
      var hasConnection = false;
      // Helper function for post-insert actions.
      function finish (connection, cb) {
        // Insert children as well.
        insertChildren(connection, function (err) {
          if (err)
            failed(err, cb);
          else {
            markAsPristine();
            // Launch finish event.
            /**
             * The event arises after the business object collection has been created in the repository.
             * @event EditableRootCollection#postInsert
             * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
             * @param {EditableRootCollection} newObject - The instance of the collection after the data portal action.
             */
            raiseEvent(DataPortalEvent.postInsert);
            raiseSave(DataPortalEvent.postSave, DataPortalAction.insert);
            cb(null, self);
          }
        });
      }
      // Helper callback for failure.
      function failed (err, cb) {
        if (hasConnection) {
          // Launch finish event.
          var dpError = wrapError(DataPortalAction.insert, err);
          raiseEvent(DataPortalEvent.postInsert, null, dpError);
          raiseSave(DataPortalEvent.postSave, DataPortalAction.insert, dpError);
        }
        cb(err);
      }
      // Main activity.
      function main (connection, cb) {
        hasConnection = connection !== null;
        // Launch start event.
        raiseSave(DataPortalEvent.preSave, DataPortalAction.insert);
        /**
         * The event arises before the business object collection will be created in the repository.
         * @event EditableRootCollection#preInsert
         * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
         * @param {EditableRootCollection} oldObject - The instance of the collection before the data portal action.
         */
        raiseEvent(DataPortalEvent.preInsert);
        // Execute insert - nothing to do.
        finish(connection, cb);
      }
      // Check permissions.
      if (canDo(AuthorizationAction.createObject))
        runTransaction(main, DataPortalAction.insert, callback);
      else
        callback(null, self);
    }

    //endregion

    //region Update

    function data_update (callback) {
      var hasConnection = false;
      // Helper function for post-update actions.
      function finish (connection, cb) {
        // Update children as well.
        updateChildren(connection, function (err) {
          if (err)
            failed(err, cb);
          else {
            markAsPristine();
            // Launch finish event.
            /**
             * The event arises after the business object collection has been updated in the repository.
             * @event EditableRootCollection#postUpdate
             * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
             * @param {EditableRootCollection} newObject - The instance of the collection after the data portal action.
             */
            raiseEvent(DataPortalEvent.postUpdate);
            raiseSave(DataPortalEvent.postSave, DataPortalAction.update);
            cb(null, self);
          }
        });
      }
      // Helper callback for failure.
      function failed (err, cb) {
        if (hasConnection) {
          // Launch finish event.
          var dpError = wrapError(DataPortalAction.update, err);
          raiseEvent(DataPortalEvent.postUpdate, null, dpError);
          raiseSave(DataPortalEvent.postSave, DataPortalAction.update, dpError);
        }
        cb(err);
      }
      // Main activity.
      function main (connection, cb) {
        hasConnection = connection !== null;
        // Launch start event.
        raiseSave(DataPortalEvent.preSave, DataPortalAction.update);
        /**
         * The event arises before the business object collection will be updated in the repository.
         * @event EditableRootCollection#preUpdate
         * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
         * @param {EditableRootCollection} oldObject - The instance of the collection before the data portal action.
         */
        raiseEvent(DataPortalEvent.preUpdate);
        // Execute update - nothing to do.
        finish(connection, cb);
      }
      // Check permissions.
      if (canDo(AuthorizationAction.updateObject))
        runTransaction(main, DataPortalAction.update, callback);
      else
        callback(null, self);
    }

    //endregion

    //region Remove

    function data_remove (callback) {
      var hasConnection = false;
      // Helper callback for post-removal actions.
      function finish (cb) {
        markAsRemoved();
        // Launch finish event.
        /**
         * The event arises after the business object collection has been removed from the repository.
         * @event EditableRootCollection#postRemove
         * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
         * @param {EditableRootCollection} newObject - The instance of the collection after the data portal action.
         */
        raiseEvent(DataPortalEvent.postRemove);
        raiseSave(DataPortalEvent.postSave, DataPortalAction.remove);
        cb(null, null);
      }
      // Helper callback for failure.
      function failed (err, cb) {
        if (hasConnection) {
          // Launch finish event.
          var dpError = wrapError(DataPortalAction.remove, err);
          raiseEvent(DataPortalEvent.postRemove, null, dpError);
          raiseSave(DataPortalEvent.postSave, DataPortalAction.remove, dpError);
        }
        cb(err);
      }
      // Main activity.
      function main (connection, cb) {
        hasConnection = connection !== null;
        // Launch start event.
        raiseSave(DataPortalEvent.preSave, DataPortalAction.remove);
        /**
         * The event arises before the business object collection will be removed from the repository.
         * @event EditableRootCollection#preRemove
         * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
         * @param {EditableRootCollection} oldObject - The instance of the collection before the data portal action.
         */
        raiseEvent(DataPortalEvent.preRemove);
        // Remove children first.
        removeChildren(connection, function (err) {
          if (err)
            failed(err, cb);
          else {
            // Execute removal - nothing to do.
            finish(cb);
          }
        });
      }
      // Check permissions.
      if (canDo(AuthorizationAction.removeObject))
        runTransaction(main, DataPortalAction.remove, callback);
      else
        callback(null, null);
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
     * @param {external.cbDataPortal} callback - Returns a new editable business object collection.
     *
     * @throws {@link bo.system.ArgumentError Argument error}:
     *      The callback must be a function.
     * @throws {@link bo.rules.AuthorizationError Authorization error}:
     *      The user has no permission to execute the action.
     * @throws {@link bo.shared.DataPortalError Data portal error}:
     *      Creating the business object collection has failed.
     */
    this.create = function(callback) {

      callback = EnsureArgument.isMandatoryFunction(callback,
          'm_manFunction', CLASS_NAME, 'create', 'callback');

      data_create(callback);
    };

    /**
     * Creates a new item and adds it to the collection at the specified index.
     *
     * @function EditableRootCollection#create
     * @param {number} index - The index of the new item.
     * @param {external.cbDataPortal} callback - Returns the newly created business object
     *      of the collection.
     */
    this.createItem = function (index, callback) {
      if (!callback) {
        callback = index;
        index = items.length;
      }

      callback = EnsureArgument.isMandatoryFunction(callback,
          'm_manFunction', CLASS_NAME, 'createItem', 'callback');

      itemType.create(self, eventHandlers, function (err, item) {
        if (err)
          callback(err);
        else {
          var ix = parseInt(index, 10);
          ix = isNaN(ix) ? items.length : ix;
          items.splice(ix, 0, item);
          callback(null, item);
        }
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
     * @param {external.cbDataPortal} callback - Returns the required editable business object collection.
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
    this.fetch = function(filter, method, callback) {

      method = EnsureArgument.isOptionalString(method,
          'm_optString', CLASS_NAME, 'fetch', 'method');
      callback = EnsureArgument.isMandatoryFunction(callback,
          'm_manFunction', CLASS_NAME, 'fetch', 'callback');

      data_fetch(filter, method || M_FETCH, callback);
    };

    /**
     * Saves the changes of the business object collection to the repository.
     *
     * @function EditableRootCollection#save
     * @param {external.cbDataPortal} callback - Returns the business object
     *      collection with the new state after the save.
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
    this.save = function(callback) {

      callback = EnsureArgument.isMandatoryFunction(callback,
          'm_manFunction', CLASS_NAME, 'save', 'callback');

      function clearRemovedItems() {
        items = items.filter(function (item) {
          return item.getModelState() !== MODEL_STATE.getName(MODEL_STATE.removed);
        });
      }
      if (this.isValid()) {
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
            data_insert(callback);
            break;
          case MODEL_STATE.changed:
            data_update(function (err, updated) {
              if (err)
                callback(err);
              else {
                clearRemovedItems();
                callback(null, self);
              }
            });
            break;
          case MODEL_STATE.markedForRemoval:
            data_remove(function (err, removed) {
              if (err)
                callback(err);
              else {
                clearRemovedItems();
                callback(null, self);
              }
            });
            break;
          default:
            callback(null, this);
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
     * @returns {EditableChildModel} The required collection item.
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
     * @returns {Array.<EditableChildModel>} The new array of collection items.
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
     * @returns {Array.<EditableChildModel>} The sorted collection.
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
   * @param {external.cbDataPortal} callback - Returns a new editable business object collection.
   *
   * @throws {@link bo.system.ArgumentError Argument error}:
   *      The event handlers must be an EventHandlerList object or null.
   * @throws {@link bo.rules.AuthorizationError Authorization error}:
   *      The user has no permission to execute the action.
   * @throws {@link bo.shared.DataPortalError Data portal error}:
   *      Creating the business object collection has failed.
   */
  EditableRootCollection.create = function(eventHandlers, callback) {
    var instance = new EditableRootCollection(eventHandlers);
    instance.create(function (err) {
      if (err)
        callback(err);
      else
        callback(null, instance);
    });
  };

  /**
   * Retrieves an editable business object collection from the repository.
   *
   * @function EditableRootCollection.fetch
   * @param {*} [filter] - The filter criteria.
   * @param {string} [method] - An alternative fetch method of the data access object.
   * @param {bo.shared.EventHandlerList} [eventHandlers] - The event handlers of the instance.
   * @param {external.cbDataPortal} callback - Returns the required editable business object collection.
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
  EditableRootCollection.fetch = function(filter, method, eventHandlers, callback) {
    var instance = new EditableRootCollection(eventHandlers);
    instance.fetch(filter, method, function (err) {
      if (err)
        callback(err);
      else
        callback(null, instance);
    });
  };

  //endregion

  return EditableRootCollection;
};

module.exports = EditableRootCollectionFactory;
