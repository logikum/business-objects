'use strict';

//region Imports

var util = require('util');
var config = require('./shared/configuration-reader.js');
var EnsureArgument = require('./system/ensure-argument.js');

var CollectionBase = require('./collection-base.js');
var ModelError = require('./shared/model-error.js');
var ExtensionManagerSync = require('./shared/extension-manager-sync.js');
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
var CLASS_NAME = 'EditableRootCollectionSync';
var MODEL_DESC = 'Editable root collection';
var M_FETCH = DataPortalAction.getName(DataPortalAction.fetch);

//endregion

var EditableRootCollectionSyncFactory = function (name, itemType, rules, extensions) {

  name = EnsureArgument.isMandatoryString(name,
      'c_manString', CLASS_NAME, 'name');
  rules = EnsureArgument.isMandatoryType(rules, RuleManager,
      'c_manType', CLASS_NAME, 'rules');
  extensions = EnsureArgument.isMandatoryType(extensions, ExtensionManagerSync,
      'c_manType', CLASS_NAME, 'extensions');

  // Verify the model type of the item type.
  if (itemType.modelType !== 'EditableChildModelSync')
    throw new ModelError('invalidItem',
        itemType.prototype.name, itemType.modelType,
        CLASS_NAME, 'EditableChildModelSync');

  // Get data access object.
  var dao = extensions.getDataAccessObject(name);

  var EditableRootCollectionSync = function (eventHandlers) {
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
     * @name EditableRootCollectionSync#$modelName
     * @type {string}
     * @readonly
     */
    this.$modelName = name;

    /**
     * The count of the child objects in the collection.
     *
     * @name EditableRootCollectionSync#count
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
     * @function EditableRootCollectionSync#childHasChanged
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
     * @function EditableRootCollectionSync#getModelState
     * @returns {string} The state of the collection.
     */
    this.getModelState = function () {
      return MODEL_STATE.getName(state);
    };

    /**
     * Indicates whether the business object collection has been created newly
     * and not has been yet saved, i.e. its state is created.
     *
     * @function EditableRootCollectionSync#isNew
     * @returns {boolean} True when the business object collection is new, otherwise false.
     */
    this.isNew = function () {
      return state === MODEL_STATE.created;
    };

    /**
     * Indicates whether the business object collection itself or any of its child objects differs the
     * one that is stored in the repository, i.e. its state is created, changed or markedForRemoval.
     *
     * @function EditableRootCollectionSync#isDirty
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
     * @function EditableRootCollectionSync#isSelfDirty
     * @returns {boolean} True when the business object collection itself has been changed, otherwise false.
     */
    this.isSelfDirty = function () {
      return isDirty;
    };

    /**
     * Indicates whether the business object collection will be deleted from the repository,
     * i.e. its state is markedForRemoval.
     *
     * @function EditableRootCollectionSync#isDeleted
     * @returns {boolean} True when the business object collection will be deleted, otherwise false.
     */
    this.isDeleted = function () {
      return state === MODEL_STATE.markedForRemoval;
    };

    /**
     * Indicates whether the business object collection can be saved to the repository,
     * i.e. it has ben changed and is valid, and the user has permission to save it.
     *
     * @function EditableRootCollectionSync#isSavable
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
     * @function EditableRootCollectionSync#toCto
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
     * @function EditableRootCollectionSync#fromCto
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
      items.forEach(function (item) {
        item.fetch(dto[property.name]);
      });
    }

    function insertChildren (connection) {
      items.forEach(function (item) {
        item.save(connection);
      });
    }

    function updateChildren (connection) {
      items.forEach(function (item) {
        item.save(connection);
      });
    }

    function removeChildren (connection) {
      items.forEach(function (item) {
        item.save(connection);
      });
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

    //endregion

    //region Create

    function data_create () {
      //if (extensions.dataCreate || dao.$hasCreate()) {
        try {
          // Open connection.
          connection = config.connectionManager.openConnection(extensions.dataSource);
          // Launch start event.
          /**
           * The event arises before the business object collection will be initialized in the repository.
           * @event EditableRootCollectionSync#preCreate
           * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
           * @param {EditableRootCollectionSync} oldObject - The instance of the collection before the data portal action.
           */
          raiseEvent(DataPortalEvent.preCreate);
          // Execute creation.
          //if (extensions.dataCreate) {
          //  // *** Custom creation.
          //  extensions.dataCreate.call(self, getDataContext(connection));
          //} else {
          //  // *** Standard creation.
          //  var dto = dao.$runMethod('create', connection);
          //  fromDto.call(self, dto);
          //}
          markAsCreated();
          // Launch finish event.
          /**
           * The event arises after the business object collection has been initialized in the repository.
           * @event EditableRootCollectionSync#postCreate
           * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
           * @param {EditableRootCollectionSync} newObject - The instance of the collection after the data portal action.
           */
          raiseEvent(DataPortalEvent.postCreate);
          // Close connection.
          connection = config.connectionManager.closeConnection(extensions.dataSource, connection);
        } catch (e) {
          // Wrap the intercepted error.
          var dpError = wrapError(DataPortalAction.create, e);
          // Launch finish event.
          if (connection)
            raiseEvent(DataPortalEvent.postCreate, null, dpError);
          // Close connection.
          connection = config.connectionManager.closeConnection(extensions.dataSource, connection);
          // Rethrow error.
          throw dpError;
        }
      //}
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
           * @event EditableRootCollectionSync#preFetch
           * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
           * @param {EditableRootCollectionSync} oldObject - The collection instance before the data portal action.
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
          // Load children.
          if (dto instanceof Array) {
            dto.forEach(function (data) {
              var item = itemType.load(self, data, eventHandlers);
              items.push(item);
            });
          }
          markAsPristine();
          // Launch finish event.
          /**
           * The event arises after the collection instance has been retrieved from the repository.
           * @event EditableRootCollectionSync#postFetch
           * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
           * @param {EditableRootCollectionSync} newObject - The collection instance after the data portal action.
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

    //region Insert

    function data_insert () {
      // Check permissions.
      if (canDo(AuthorizationAction.createObject)) {
        try {
          // Start transaction.
          connection = config.connectionManager.beginTransaction(extensions.dataSource);
          // Launch start event.
          raiseSave(DataPortalEvent.preSave, DataPortalAction.insert);
          /**
           * The event arises before the business object collection will be created in the repository.
           * @event EditableRootCollectionSync#preInsert
           * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
           * @param {EditableRootCollectionSync} oldObject - The instance of the collection before the data portal action.
           */
          raiseEvent(DataPortalEvent.preInsert);
          // Execute insert.
          //if (extensions.dataInsert) {
          //  // *** Custom insert.
          //  extensions.dataInsert.call(self, getDataContext(connection));
          //} else {
          //  // *** Standard insert.
          //  var dto = toDto.call(self);
          //  var dto = dao.$runMethod('insert', connection, dto);
          //  fromDto.call(self, dto);
          //}
          // Insert children as well.
          insertChildren(connection);
          markAsPristine();
          // Launch finish event.
          /**
           * The event arises after the business object collection has been created in the repository.
           * @event EditableRootCollectionSync#postInsert
           * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
           * @param {EditableRootCollectionSync} newObject - The instance of the collection after the data portal action.
           */
          raiseEvent(DataPortalEvent.postInsert);
          raiseSave(DataPortalEvent.postSave, DataPortalAction.insert);
          // Finish transaction.
          connection = config.connectionManager.commitTransaction(extensions.dataSource, connection);
        } catch (e) {
          // Wrap the intercepted error.
          var dpError = wrapError(DataPortalAction.insert, e);
          // Launch finish event.
          if (connection) {
            raiseEvent(DataPortalEvent.postInsert, null, dpError);
            raiseSave(DataPortalEvent.postSave, DataPortalAction.insert, dpError);
          }
          // Undo transaction.
          connection = config.connectionManager.rollbackTransaction(extensions.dataSource, connection);
          // Rethrow error.
          throw dpError;
        }
      }
    }

    //endregion

    //region Update

    function data_update () {
      // Check permissions.
      if (canDo(AuthorizationAction.updateObject)) {
        try {
          // Start transaction.
          connection = config.connectionManager.beginTransaction(extensions.dataSource);
          // Launch start event.
          raiseSave(DataPortalEvent.preSave, DataPortalAction.update);
          /**
           * The event arises before the business object collection will be updated in the repository.
           * @event EditableRootCollectionSync#preUpdate
           * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
           * @param {EditableRootCollectionSync} oldObject - The instance of the collection before the data portal action.
           */
          raiseEvent(DataPortalEvent.preUpdate);
          // Execute update.
          //if (extensions.dataUpdate) {
          //  // *** Custom update.
          //  extensions.dataUpdate.call(self, getDataContext(connection));
          //} else if (isDirty) {
          //  // *** Standard update.
          //  var dto = toDto.call(self);
          //  var dto = dao.$runMethod('update', connection, dto);
          //  fromDto.call(self, dto);
          //}
          // Update children as well.
          updateChildren(connection);
          markAsPristine();
          // Launch finish event.
          /**
           * The event arises after the business object collection has been updated in the repository.
           * @event EditableRootCollectionSync#postUpdate
           * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
           * @param {EditableRootCollectionSync} newObject - The instance of the collection after the data portal action.
           */
          raiseEvent(DataPortalEvent.postUpdate);
          raiseSave(DataPortalEvent.postSave, DataPortalAction.update);
          // Finish transaction.
          connection = config.connectionManager.commitTransaction(extensions.dataSource, connection);
        } catch (e) {
          // Wrap the intercepted error.
          var dpError = wrapError(DataPortalAction.update, e);
          // Launch finish event.
          if (connection) {
            raiseEvent(DataPortalEvent.postUpdate, null, dpError);
            raiseSave(DataPortalEvent.postSave, DataPortalAction.update, dpError);
          }
          // Undo transaction.
          connection = config.connectionManager.rollbackTransaction(extensions.dataSource, connection);
          // Rethrow error.
          throw dpError;
        }
      }
    }

    //endregion

    //region Remove

    function data_remove () {
      // Check permissions.
      if (canDo(AuthorizationAction.removeObject)) {
        try {
          // Start transaction.
          connection = config.connectionManager.beginTransaction(extensions.dataSource);
          // Launch start event.
          raiseSave(DataPortalEvent.preSave, DataPortalAction.remove);
          /**
           * The event arises before the business object collection will be removed from the repository.
           * @event EditableRootCollectionSync#preRemove
           * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
           * @param {EditableRootCollectionSync} oldObject - The instance of the collection before the data portal action.
           */
          raiseEvent(DataPortalEvent.preRemove);
          // Remove children first.
          removeChildren(connection);
          // Execute removal - finished.
          markAsRemoved();
          // Launch finish event.
          /**
           * The event arises after the business object collection has been removed from the repository.
           * @event EditableRootCollectionSync#postRemove
           * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
           * @param {EditableRootCollectionSync} newObject - The instance of the collection after the data portal action.
           */
          raiseEvent(DataPortalEvent.postRemove);
          raiseSave(DataPortalEvent.postSave, DataPortalAction.remove);
          // Finish transaction.
          connection = config.connectionManager.commitTransaction(extensions.dataSource, connection);
        } catch (e) {
          // Wrap the intercepted error.
          var dpError = wrapError(DataPortalAction.remove, e);
          // Launch finish event.
          if (connection) {
            raiseEvent(DataPortalEvent.postRemove, null, dpError);
            raiseSave(DataPortalEvent.postSave, DataPortalAction.remove, dpError);
          }
          // Undo transaction.
          connection = config.connectionManager.rollbackTransaction(extensions.dataSource, connection);
          // Rethrow error.
          throw dpError;
        }
      }
    }

    //endregion

    //endregion

    //region Actions

    /**
     * Initializes a newly created business object collection.
     * <br/>_This method is called by a factory method with the same name._
     *
     * @function EditableRootCollectionSync#create
     * @protected
     *
     * @throws {@link bo.rules.AuthorizationError Authorization error}:
     *      The user has no permission to execute the action.
     * @throws {@link bo.shared.DataPortalError Data portal error}:
     *      Creating the business object collection has failed.
     */
    this.create = function() {
      data_create();
    };

    /**
     * Creates a new item and adds it to the collection at the specified index.
     *
     * @function EditableRootCollectionSync#create
     * @param {number} index - The index of the new item.
     * @returns {EditableChildModelSync} The newly created business object.
     */
    this.createItem = function (index) {
      var item = itemType.create(self, eventHandlers);
      var ix = parseInt(index, 10);
      ix = isNaN(ix) ? items.length : ix;
      items.splice(ix, 0, item);
      return item;
    };

    /**
     * Initializes a business object collection to be retrieved from the repository.
     * <br/>_This method is called by a factory method with the same name._
     *
     * @function EditableRootCollectionSync#fetch
     * @protected
     * @param {*} [filter] - The filter criteria.
     * @param {string} [method] - An alternative fetch method of the data access object.
     *
     * @throws {@link bo.system.ArgumentError Argument error}:
     *      The method must be a string or null.
     * @throws {@link bo.rules.AuthorizationError Authorization error}:
     *      The user has no permission to execute the action.
     * @throws {@link bo.shared.DataPortalError Data portal error}:
     *      Fetching the business object collection has failed.
     */
    this.fetch = function(filter, method) {

      method = EnsureArgument.isOptionalString(method,
          'm_optString', CLASS_NAME, 'fetch', 'method');

      data_fetch(filter, method || M_FETCH);
    };

    /**
     * Saves the changes of the business object collection to the repository.
     *
     * @function EditableRootCollectionSync#save
     * @returns {EditableRootCollectionSync} The business object collection with the new state after the save.
     *
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
         * @event EditableRootCollectionSync#preSave
         * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
         * @param {EditableRootCollectionSync} oldObject - The instance of the collection before the data portal action.
         */
        switch (state) {
          case MODEL_STATE.created:
            data_insert();
            return this;
          case MODEL_STATE.changed:
            data_update();
            clearRemovedItems();
            return this;
          case MODEL_STATE.markedForRemoval:
            data_remove();
            clearRemovedItems();
            return null;
          default:
            return this;
        }
        /**
         * The event arises after the business object collection has been saved in the repository.
         * The event is preceded by a postInsert, postUpdate or postRemove event depending on the
         * state of the business object collection.
         * @event EditableRootCollectionSync#postSave
         * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
         * @param {EditableRootCollectionSync} newObject - The instance of the collection after the data portal action.
         */
      }
    };

    /**
     * Marks the business object collection to be deleted from the repository on next save.
     *
     * @function EditableRootCollectionSync#remove
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
     * @function EditableRootCollectionSync#isValid
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
     * @function EditableRootCollectionSync#checkRules
     */
    this.checkRules = function () {
      brokenRules.clear();

      checkChildRules();

      isValidated = true;
    };

    /**
     * Gets the broken rules of the business object.
     *
     * @function EditableRootCollectionSync#getBrokenRules
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
     * @function EditableRootCollectionSync#getResponse
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
     * @function EditableRootCollectionSync#at
     * @param {number} index - The index of the required item in the collection.
     * @returns {EditableChildModelSync} The required collection item.
     */
    this.at = function (index) {
      return items[index];
    };

    /**
     * Executes a provided function once per collection item.
     *
     * @function EditableRootCollectionSync#forEach
     * @param {external.cbCollectionItem} callback - Function that produces an item of the new collection.
     */
    this.forEach = function (callback) {
      items.forEach(callback);
    };

    /**
     * Tests whether all items in the collection pass the test implemented by the provided function.
     *
     * @function EditableRootCollectionSync#every
     * @param {external.cbCollectionItem} callback - Function to test for each collection item.
     * @returns {boolean} True when callback returns truthy value for each item, otherwise false.
     */
    this.every = function (callback) {
      return items.every(callback);
    };

    /**
     * Tests whether some item in the collection pass the test implemented by the provided function.
     *
     * @function EditableRootCollectionSync#some
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
     * @function EditableRootCollectionSync#filter
     * @param {external.cbCollectionItem} callback - Function to test for each collection item.
     * @returns {Array.<EditableChildModelSync>} The new array of collection items.
     */
    this.filter = function (callback) {
      return items.filter(callback);
    };

    /**
     * Creates a new array with the results of calling a provided function
     * on every item in this collection.
     *
     * @function EditableRootCollectionSync#map
     * @param {external.cbCollectionItem} callback - Function to test for each collection item.
     * @returns {Array.<*>} The new array of callback results.
     */
    this.map = function (callback) {
      return items.map(callback);
    };

    /**
     * Sorts the items of the collection in place and returns the collection.
     *
     * @function EditableRootCollectionSync#sort
     * @param {external.cbCompare} [fnCompare] - Function that defines the sort order.
     *      If omitted, the collection is sorted according to each character's Unicode
     *      code point value, according to the string conversion of each item.
     * @returns {Array.<EditableChildModelSync>} The sorted collection.
     */
    this.sort = function (fnCompare) {
      return items.sort(fnCompare);
    };

    //endregion

    // Immutable object.
    Object.freeze(this);
  };
  util.inherits(EditableRootCollectionSync, CollectionBase);

  /**
   * The name of the model type.
   *
   * @property {string} EditableRootCollectionSync.constructor.modelType
   * @default EditableRootCollectionSync
   * @readonly
   */
  Object.defineProperty(EditableRootCollectionSync, 'modelType', {
    get: function () { return CLASS_NAME; }
  });

  //region Factory methods

  /**
   * Creates a new editable business object collection.
   *
   * @function EditableRootCollectionSync.create
   * @param {bo.shared.EventHandlerList} [eventHandlers] - The event handlers of the instance.
   * @returns {EditableRootCollectionSync} A new editable business collection.
   *
   * @throws {@link bo.system.ArgumentError Argument error}:
   *      The event handlers must be an EventHandlerList object or null.
   * @throws {@link bo.rules.AuthorizationError Authorization error}:
   *      The user has no permission to execute the action.
   * @throws {@link bo.shared.DataPortalError Data portal error}:
   *      Creating the business object collection has failed.
   */
  EditableRootCollectionSync.create = function(eventHandlers) {
    var instance = new EditableRootCollectionSync(eventHandlers);
    instance.create();
    return instance;
  };

  /**
   * Retrieves an editable business object collection from the repository.
   *
   * @function EditableRootCollectionSync.fetch
   * @param {*} [filter] - The filter criteria.
   * @param {string} [method] - An alternative fetch method of the data access object.
   * @param {bo.shared.EventHandlerList} [eventHandlers] - The event handlers of the instance.
   * @returns {EditableRootCollectionSync} The required editable business object collection.
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
  EditableRootCollectionSync.fetch = function(filter, method, eventHandlers) {
    var instance = new EditableRootCollectionSync(eventHandlers);
    instance.fetch(filter, method);
    return instance;
  };

  //endregion

  return EditableRootCollectionSync;
};

module.exports = EditableRootCollectionSyncFactory;
