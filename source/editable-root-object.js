'use strict';

//region Imports

var util = require('util');
var config = require('./shared/configuration-reader.js');
var Argument = require('./system/argument-check.js');
var Enumeration = require('./system/enumeration.js');

var ModelBase = require('./model-base.js');
var ModelError = require('./shared/model-error.js');
var ExtensionManager = require('./shared/extension-manager.js');
var EventHandlerList = require('./shared/event-handler-list.js');
var DataStore = require('./shared/data-store.js');
var DataType = require('./data-types/data-type.js');

var PropertyInfo = require('./shared/property-info.js');
var PropertyManager = require('./shared/property-manager.js');
var PropertyContext = require('./shared/property-context.js');
var ValidationContext = require('./rules/validation-context.js');
var TransferContext = require('./shared/transfer-context.js');

var RuleManager = require('./rules/rule-manager.js');
var DataTypeRule = require('./rules/data-type-rule.js');
var BrokenRuleList = require('./rules/broken-rule-list.js');
var RuleSeverity = require('./rules/rule-severity.js');
var AuthorizationAction = require('./rules/authorization-action.js');
var AuthorizationContext = require('./rules/authorization-context.js');
var BrokenRulesResponse = require('./rules/broken-rules-response.js');

var DataPortalAction = require('./shared/data-portal-action.js');
var DataPortalContext = require('./shared/data-portal-context.js');
var DataPortalEvent = require('./shared/data-portal-event.js');
var DataPortalEventArgs = require('./shared/data-portal-event-args.js');
var DataPortalError = require('./shared/data-portal-error.js');

var MODEL_STATE = require('./shared/model-state.js');
var CLASS_NAME = 'EditableRootObject';
var MODEL_DESC = 'Editable root object';
var M_FETCH = DataPortalAction.getName(DataPortalAction.fetch);

//endregion

/**
 * Factory method to create definitions of asynchronous editable root objects.
 *
 *    Valid child model types are:
 *
 *      * EditableChildCollection
 *      * EditableChildObject
 *
 * @function bo.EditableRootObject
 * @param {string} name - The name of the model.
 * @param {bo.shared.PropertyManager} properties - The property definitions.
 * @param {bo.shared.RuleManager} rules - The validation and authorization rules.
 * @param {bo.shared.ExtensionManager} extensions - The customization of the model.
 * @returns {EditableRootObject} The constructor of an asynchronous editable root object.
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The model name must be a non-empty string.
 * @throws {@link bo.system.ArgumentError Argument error}: The properties must be a PropertyManager object.
 * @throws {@link bo.system.ArgumentError Argument error}: The rules must be a RuleManager object.
 * @throws {@link bo.system.ArgumentError Argument error}: The extensions must be a ExtensionManager object.
 *
 * @throws {@link bo.shared.ModelError Model error}:
 *    The child objects must be EditableChildCollection or EditableChildObject instances.
 */
var EditableRootObjectFactory = function (name, properties, rules, extensions) {
  var check = Argument.inConstructor(CLASS_NAME);

  name = check(name).forMandatory('name').asString();
  properties = check(properties).forMandatory('properties').asType(PropertyManager);
  rules = check(rules).forMandatory('rules').asType(RuleManager);
  extensions = check(extensions).forMandatory('extensions').asType(ExtensionManager);

  // Verify the model types of child objects.
  properties.modelName = name;
  properties.verifyChildTypes([ 'EditableChildCollection', 'EditableChildObject' ]);

  // Get data access object.
  var dao = extensions.getDataAccessObject(name);

  /**
   * @classdesc
   *    Represents the definition of an asynchronous editable root object.
   * @description
   *    Creates a new asynchronous editable root object instance.
   *
   *    _The name of the model type available as:
   *    __&lt;instance&gt;.constructor.modelType__, returns 'EditableRootObject'._
   *
   * @name EditableRootObject
   * @constructor
   * @param {bo.shared.EventHandlerList} [eventHandlers] - The event handlers of the instance.
   *
   * @extends ModelBase
   *
   * @throws {@link bo.system.ArgumentError Argument error}:
   *    The event handlers must be an EventHandlerList object or null.
   *
   * @fires EditableRootObject#preCreate
   * @fires EditableRootObject#postCreate
   * @fires EditableRootObject#preFetch
   * @fires EditableRootObject#postFetch
   * @fires EditableRootObject#preInsert
   * @fires EditableRootObject#postInsert
   * @fires EditableRootObject#preUpdate
   * @fires EditableRootObject#postUpdate
   * @fires EditableRootObject#preRemove
   * @fires EditableRootObject#postRemove
   * @fires EditableRootObject#preSave
   * @fires EditableRootObject#postSave
   */
  var EditableRootObject = function (eventHandlers) {
    ModelBase.call(this);

    eventHandlers = Argument.inConstructor(name)
        .check(eventHandlers).forOptional('eventHandlers').asType(EventHandlerList);

    var self = this;
    var state = null;
    var isDirty = false;
    var store = new DataStore();
    var brokenRules = new BrokenRuleList(name);
    var isValidated = false;
    var propertyContext = null;
    var dataContext = null;

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
     * @function EditableRootObject#childHasChanged
     * @protected
     */
    this.childHasChanged = function() {
      markAsChanged(false);
    };

    function propagateRemoval() {
      properties.children().forEach(function(property) {
        var child = getPropertyValue(property);
        child.remove();
      });
    }

    //endregion

    //region Show object state

    /**
     * Gets the state of the model. Valid states are:
     * pristine, created, changed, markedForRemoval and removed.
     *
     * @function EditableRootObject#getModelState
     * @returns {string} The state of the model.
     */
    this.getModelState = function () {
      return MODEL_STATE.getName(state);
    };

    /**
     * Indicates whether the business object has been created newly and
     * not has been yet saved, i.e. its state is created.
     *
     * @function EditableRootObject#isNew
     * @returns {boolean} True when the business object is new, otherwise false.
     */
    this.isNew = function () {
      return state === MODEL_STATE.created;
    };

    /**
     * Indicates whether the business object itself or any of its child objects differs the one
     * that is stored in the repository, i.e. its state is created, changed or markedForRemoval.
     *
     * @function EditableRootObject#isDirty
     * @returns {boolean} True when the business object has been changed, otherwise false.
     */
    this.isDirty = function () {
      return state === MODEL_STATE.created ||
             state === MODEL_STATE.changed ||
             state === MODEL_STATE.markedForRemoval;
    };

    /**
     * Indicates whether the business object itself, ignoring its child objects, differs the one
     * that is stored in the repository.
     *
     * @function EditableRootObject#isSelfDirty
     * @returns {boolean} True when the business object itself has been changed, otherwise false.
     */
    this.isSelfDirty = function () {
      return isDirty;
    };

    /**
     * Indicates whether the business object will be deleted from the repository,
     * i.e. its state is markedForRemoval.
     *
     * @function EditableRootObject#isDeleted
     * @returns {boolean} True when the business object will be deleted, otherwise false.
     */
    this.isDeleted = function () {
      return state === MODEL_STATE.markedForRemoval;
    };

    /**
     * Indicates whether the business object can be saved to the repository,
     * i.e. it has ben changed and is valid, and the user has permission to save it.
     *
     * @function EditableRootObject#isSavable
     * @returns {boolean} True when the user can save the business object, otherwise false.
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
      return authorize ?
          new TransferContext(properties.toArray(), readPropertyValue, writePropertyValue) :
          new TransferContext(properties.toArray(), getPropertyValue, setPropertyValue);
    }

    function baseToDto() {
      var dto = {};
      properties.filter(function (property) {
        return property.isOnDto;
      }).forEach(function (property) {
        dto[property.name] = getPropertyValue(property);
      });
      return dto;
    }

    function toDto () {
      if (extensions.toDto)
        return extensions.toDto.call(self, getTransferContext(false));
      else
        return baseToDto();
    }

    function baseFromDto(dto) {
      properties.filter(function (property) {
        return property.isOnDto;
      }).forEach(function (property) {
        if (dto.hasOwnProperty(property.name) && typeof dto[property.name] !== 'function') {
          setPropertyValue(property, dto[property.name]);
        }
      });
    }

    function fromDto (dto) {
      if (extensions.fromDto)
        extensions.fromDto.call(self, getTransferContext(false), dto);
      else
        baseFromDto(dto);
    }

    function baseToCto() {
      var cto = {};
      properties.filter(function (property) {
        return property.isOnCto;
      }).forEach(function (property) {
        cto[property.name] = readPropertyValue(property);
      });
      return cto;
    }

    /**
     * Transforms the business object to a plain object to send to the client.
     *
     * @function EditableRootObject#toCto
     * @returns {object} The client transfer object.
     */
    this.toCto = function () {
      var cto = {};
      if (extensions.toCto)
        cto = extensions.toCto.call(self, getTransferContext(true));
      else
        cto = baseToCto();

      properties.children().forEach(function(property) {
        var child = getPropertyValue(property);
        cto[property.name] = child.toCto();
      });
      return cto;
    };

    function baseFromCto(cto) {
      if (cto && typeof cto === 'object') {
        properties.filter(function (property) {
          return property.isOnCto;
        }).forEach(function (property) {
          if (cto.hasOwnProperty(property.name) && typeof cto[property.name] !== 'function') {
            writePropertyValue(property, cto[property.name]);
          }
        });
      }
    }

    /**
     * Rebuilds the business object from a plain object sent by the client.
     *
     * @function EditableRootObject#fromCto
     * @param {object} cto - The client transfer object.
     * @param {external.cbFromCto} callback - Returns the eventual error.
     */
    this.fromCto = function (cto) {
      return new Promise( function ( fulfill, reject ) {
        if (extensions.fromCto)
          extensions.fromCto.call(self, getTransferContext(true), cto);
        else
          baseFromCto(cto);

        // Build children.
        var count = properties.childCount();
        var error = null;

        function finish(err) {
          if (err)
            error = error || err;
          if (--count == 0)
            return error ? reject(error) : fulfill(null);
        }

        properties.children().forEach(function (property) {
          var child = getPropertyValue(property);
          if (cto[property.name])
            child.fromCto(cto[property.name], finish);
          else
            finish(null);
        });
      });
    };

    //endregion

    //region Permissions

    function getAuthorizationContext(action, targetName) {
      return new AuthorizationContext(action, targetName || '', brokenRules);
    }

    function canBeRead (property) {
      return rules.hasPermission(
          getAuthorizationContext(AuthorizationAction.readProperty, property.name)
      );
    }

    function canBeWritten (property) {
      return rules.hasPermission(
          getAuthorizationContext(AuthorizationAction.writeProperty, property.name)
      );
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

    function fetchChildren(dto, callback) {
      var count = 0;
      var error = null;

      function finish (err) {
        error = error || err;
        // Check if all children are done.
        if (++count === properties.childCount()) {
          callback(error);
        }
      }
      if (properties.childCount()) {
        properties.children().forEach(function(property) {
          var child = getPropertyValue(property);
          if (child instanceof ModelBase)
            child.fetch(dto[property.name], undefined, finish);
          else
            child.fetch(dto[property.name], finish);
        });
      } else
        callback(null);
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

      if (properties.childCount()) {
        properties.children().forEach(function (property) {
          var child = getPropertyValue(property);
          child.save(connection, function (err) {
            error = error || err;
            // Check if all children are done.
            if (++count === properties.childCount()) {
              callback(error);
            }
          });
        });
      } else
        callback(null);
    }

    function childrenAreValid() {
      return properties.children().every(function(property) {
        var child = getPropertyValue(property);
        return child.isValid();
      });
    }

    function checkChildRules() {
      properties.children().forEach(function(property) {
        var child = getPropertyValue(property);
        child.checkRules();
      });
    }

    function getChildBrokenRules (namespace, bro) {
      properties.children().forEach(function (property) {
        var child = getPropertyValue(property);
        var childBrokenRules = child.getBrokenRules(namespace);
        if (childBrokenRules) {
          if (childBrokenRules instanceof Array)
            bro.addChildren(property.name, childBrokenRules);
          else
            bro.addChild(property.name, childBrokenRules);
        }
      });
      return bro;
    }

    //endregion

    //region Data portal methods

    //region Helper

    function getDataContext (connection) {
      if (!dataContext)
        dataContext = new DataPortalContext(
            dao, properties.toArray(), getPropertyValue, setPropertyValue
        );
      return dataContext.setState(connection, isDirty);
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

    function wrapError (action, error) {
      return new DataPortalError(MODEL_DESC, name, action, error);
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
         * The event arises after the business object instance has been initialized in the repository.
         * @event EditableRootObject#postCreate
         * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
         * @param {EditableRootObject} newObject - The instance of the model after the data portal action.
         */
        raiseEvent(DataPortalEvent.postCreate);
        cb(null, self);
      }
      // Helper callback for failure.
      function failed (err, cb) {
        if (hasConnection) {
          // Launch finish event.
          var dpError = wrapError(DataPortalAction.create, err);
          raiseEvent(DataPortalEvent.postCreate, null, dpError);
        }
        cb(err);
      }
      // Main activity.
      function main (connection, cb) {
        hasConnection = connection !== null;
        // Launch start event.
        /**
         * The event arises before the business object instance will be initialized in the repository.
         * @event EditableRootObject#preCreate
         * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
         * @param {EditableRootObject} oldObject - The instance of the model before the data portal action.
         */
        raiseEvent(DataPortalEvent.preCreate);
        // Execute creation.
        if (extensions.dataCreate) {
          // *** Custom creation.
          extensions.dataCreate.call(self, getDataContext(connection), function (err) {
            if (err)
              failed(err, cb);
            else
              finish(cb);
          });
        } else {
          // *** Standard creation.
          dao.$runMethod('create', connection, function (err, dto) {
            if (err)
              failed(err, cb);
            else {
              fromDto.call(self, dto);
              finish(cb);
            }
          });
        }
      }
      if (extensions.dataCreate || dao.$hasCreate()) {
        runStatements(main, DataPortalAction.create, callback);
      }
    }

    //endregion

    //region Fetch

    function data_fetch (filter, method, callback) {
      var hasConnection = false;
      // Helper function for post-fetch actions.
      function finish (dto, cb) {
        // Fetch children as well.
        fetchChildren(dto, function (err) {
          if (err)
            failed(err, cb);
          else {
            markAsPristine();
            // Launch finish event.
            /**
             * The event arises after the business object instance has been retrieved from the repository.
             * @event EditableRootObject#postFetch
             * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
             * @param {EditableRootObject} newObject - The instance of the model after the data portal action.
             */
            raiseEvent(DataPortalEvent.postFetch, method);
            cb(null, self);
          }
        });
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
         * The event arises before the business object instance will be retrieved from the repository.
         * @event EditableRootObject#preFetch
         * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
         * @param {EditableRootObject} oldObject - The instance of the model before the data portal action.
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
              fromDto.call(self, dto);
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
             * The event arises after the business object instance has been created in the repository.
             * @event EditableRootObject#postInsert
             * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
             * @param {EditableRootObject} newObject - The instance of the model after the data portal action.
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
         * The event arises before the business object instance will be created in the repository.
         * @event EditableRootObject#preInsert
         * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
         * @param {EditableRootObject} oldObject - The instance of the model before the data portal action.
         */
        raiseEvent(DataPortalEvent.preInsert);
        // Execute insert.
        if (extensions.dataInsert) {
          // *** Custom insert.
          extensions.dataInsert.call(self, getDataContext(connection), function (err) {
            if (err)
              failed(err, cb);
            else
              finish(connection, cb);
          });
        } else {
          // *** Standard insert.
          var dto = toDto.call(self);
          dao.$runMethod('insert', connection, dto, function (err, dto) {
            if (err)
              failed(err, cb);
            else {
              fromDto.call(self, dto);
              finish(connection, cb);
            }
          });
        }
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
             * The event arises after the business object instance has been updated in the repository.
             * @event EditableRootObject#postUpdate
             * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
             * @param {EditableRootObject} newObject - The instance of the model after the data portal action.
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
         * The event arises before the business object instance will be updated in the repository.
         * @event EditableRootObject#preUpdate
         * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
         * @param {EditableRootObject} oldObject - The instance of the model before the data portal action.
         */
        raiseEvent(DataPortalEvent.preUpdate);
        // Execute update.
        if (extensions.dataUpdate) {
          // *** Custom update.
          extensions.dataUpdate.call(self, getDataContext(connection), function (err) {
            if (err)
              failed(err, cb);
            else
              finish(connection, cb);
          });
        } else if (isDirty) {
          // *** Standard update.
          var dto = toDto.call(self);
          dao.$runMethod('update', connection, dto, function (err, dto) {
            if (err)
              failed(err, cb);
            else {
              fromDto.call(self, dto);
              finish(connection, cb);
            }
          });
        } else {
          // Update children only.
          finish();
        }
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
         * The event arises after the business object instance has been removed from the repository.
         * @event EditableRootObject#postRemove
         * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
         * @param {EditableRootObject} newObject - The instance of the model after the data portal action.
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
         * The event arises before the business object instance will be removed from the repository.
         * @event EditableRootObject#preRemove
         * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
         * @param {EditableRootObject} oldObject - The instance of the model before the data portal action.
         */
        raiseEvent(DataPortalEvent.preRemove);
        // Remove children first.
        removeChildren(connection, function (err) {
          if (err)
            failed(err, cb);
          else {
            // Execute removal.
            if (extensions.dataRemove) {
              // *** Custom removal.
              extensions.dataRemove.call(self, getDataContext(connection), function (err) {
                if (err)
                  failed(err, cb);
                else
                  finish(cb);
              });
            } else {
              // *** Standard removal.
              var filter = properties.getKey(getPropertyValue);
              dao.$runMethod('remove', connection, filter, function (err) {
                if (err)
                  failed(err, cb);
                else
                  finish(cb);
              });
            }
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
     * Initializes a newly created business object.
     * <br/>_This method is called by a factory method with the same name._
     *
     * @function EditableRootObject#create
     * @protected
     * @param {external.cbDataPortal} callback - Returns a new editable business object.
     *
     * @throws {@link bo.system.ArgumentError Argument error}:
     *      The callback must be a function.
     * @throws {@link bo.rules.AuthorizationError Authorization error}:
     *      The user has no permission to execute the action.
     * @throws {@link bo.shared.DataPortalError Data portal error}:
     *      Creating the business object has failed.
     */
    this.create = function() {
      return new Promise( function ( fulfill, reject ) {
        data_create( function( err, res ) {
          if (err) reject( err );
          else fulfill( res );
        });
      });
    };

    /**
     * Initializes a business object to be retrieved from the repository.
     * <br/>_This method is called by a factory method with the same name._
     *
     * @function EditableRootObject#fetch
     * @protected
     * @param {*} [filter] - The filter criteria.
     * @param {string} [method] - An alternative fetch method of the data access object.
     * @param {external.cbDataPortal} callback - Returns the required editable business object.
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
      return new Promise( function ( fulfill, reject) {
        method = Argument.inMethod( name, 'fetch' ).check (method ).forOptional( 'method' ).asString();

        data_fetch( filter, method || M_FETCH, function ( err, res ) {
          if (err) reject( err );
          else fulfill ( res );
        });
      });
    };

    /**
     * Saves the changes of the business object to the repository.
     *
     * @function EditableRootObject#save
     * @param {external.cbDataPortal} callback - Returns the business object
     *      with the new state after the save.
     *
     * @throws {@link bo.system.ArgumentError Argument error}:
     *      The callback must be a function.
     * @throws {@link bo.rules.AuthorizationError Authorization error}:
     *      The user has no permission to execute the action.
     * @throws {@link bo.shared.DataPortalError Data portal error}:
     *      Inserting the business object has failed.
     * @throws {@link bo.shared.DataPortalError Data portal error}:
     *      Updating the business object has failed.
     * @throws {@link bo.shared.DataPortalError Data portal error}:
     *      Deleting the business object has failed.
     */
    this.save = function() {
      return new Promise( function ( fulfill, reject) {
        if (self.isValid()) {
          /**
           * The event arises before the business object instance will be saved in the repository.
           * The event is followed by a preInsert, preUpdate or preRemove event depending on the
           * state of the business object instance.
           * @event EditableRootObject#preSave
           * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
           * @param {EditableRootObject} oldObject - The instance of the model before the data portal action.
           */
          switch (state) {
            case MODEL_STATE.created:
              data_insert(function (err, inserted) {
                if (err) reject( err );
                else fulfill( inserted );
              });
              break;
            case MODEL_STATE.changed:
              data_update(function (err, updated) {
                if (err) reject( err );
                else  fulfill( updated );
              });
              break;
            case MODEL_STATE.markedForRemoval:
              data_remove(function (err, removed) {
                if (err) reject( err );
                else fulfill( removed );
              });
              break;
            default:
              callback(null, self);
          }
          /**
           * The event arises after the business object instance has been saved in the repository.
           * The event is preceded by a postInsert, postUpdate or postRemove event depending on the
           * state of the business object instance.
           * @event EditableRootObject#postSave
           * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
           * @param {EditableRootObject} newObject - The instance of the model after the data portal action.
           */
        }
      });
    };

    /**
     * Marks the business object to be deleted from the repository on next save.
     *
     * @function EditableRootObject#remove
     */
    this.remove = function() {
      markForRemoval();
    };

    //endregion

    //region Validation

    /**
     * Indicates whether all the validation rules of the business object, including
     * the ones of its child objects, succeeds. A valid business object may have
     * broken rules with severity of success, information and warning.
     *
     * @function EditableRootObject#isValid
     * @returns {boolean} True when the business object is valid, otherwise false.
     */
    this.isValid = function() {
      if (!isValidated)
        this.checkRules();

      return brokenRules.isValid() && childrenAreValid();
    };

    /**
     * Executes all the validation rules of the business object, including the ones
     * of its child objects.
     *
     * @function EditableRootObject#checkRules
     */
    this.checkRules = function() {
      brokenRules.clear();

      var context = new ValidationContext(store, brokenRules);
      properties.forEach(function(property) {
        rules.validate(property, context);
      });
      checkChildRules();

      isValidated = true;
    };

    /**
     * Gets the broken rules of the business object.
     *
     * @function EditableRootObject#getBrokenRules
     * @param {string} [namespace] - The namespace of the message keys when messages are localizable.
     * @returns {bo.rules.BrokenRulesOutput} The broken rules of the business object.
     */
    this.getBrokenRules = function(namespace) {
      var bro = brokenRules.output(namespace);
      bro = getChildBrokenRules(namespace, bro);
      return bro.$length ? bro : null;
    };

    /**
     * Gets the response to send to the client in case of broken rules.
     *
     * @function EditableRootObject#getResponse
     * @param {string} [message] - Human-readable description of the reason of the failure.
     * @param {string} [namespace] - The namespace of the message keys when messages are localizable.
     * @returns {bo.rules.BrokenRulesResponse} The broken rules response to send to the client.
     */
    this.getResponse = function (message, namespace) {
      var output = this.getBrokenRules(namespace);
      return output ? new BrokenRulesResponse(output, message) : null;
    };

    //endregion

    //region Properties

    function getPropertyValue(property) {
      return store.getValue(property);
    }

    function setPropertyValue(property, value) {
      if (store.setValue(property, value))
        markAsChanged(true);
    }

    function readPropertyValue(property) {
      if (canBeRead(property)) {
        if (property.getter)
          return property.getter(getPropertyContext(property));
        else
          return store.getValue(property);
      } else
        return null;
    }

    function writePropertyValue(property, value) {
      if (canBeWritten(property)) {
        var changed = property.setter ?
            property.setter(getPropertyContext(property), value) :
            store.setValue(property, value);
        if (changed === true)
          markAsChanged(true);
      }
    }

    function getPropertyContext(primaryProperty) {
      if (!propertyContext)
        propertyContext = new PropertyContext(
            name, properties.toArray(), readPropertyValue, writePropertyValue);
      return propertyContext.with(primaryProperty);
    }

    properties.map(function(property) {

      if (property.type instanceof DataType) {
        // Normal property
        store.initValue(property);

        Object.defineProperty(self, property.name, {
          get: function () {
            return readPropertyValue(property);
          },
          set: function (value) {
            if (property.isReadOnly)
              throw new ModelError('readOnly', name, property.name);
            writePropertyValue(property, value);
          },
          enumerable: true
        });

        rules.add(new DataTypeRule(property));

      } else {
        // Child item/collection
        if (property.type.create) // Item
          property.type.create(self, eventHandlers, function (err, item) {
            store.initValue(property, item);
          });
        else                      // Collection
          store.initValue(property, new property.type(self, eventHandlers));

        Object.defineProperty(self, property.name, {
          get: function () {
            return readPropertyValue(property);
          },
          set: function (value) {
            throw new ModelError('readOnly', name , property.name);
          },
          enumerable: false
        });
      }
    });

    //endregion

    // Immutable object.
    Object.freeze(this);
  };
  util.inherits(EditableRootObject, ModelBase);

  /**
   * The name of the model type.
   *
   * @property {string} EditableRootObject.constructor.modelType
   * @default EditableRootObject
   * @readonly
   */
  Object.defineProperty(EditableRootObject, 'modelType', {
    get: function () { return CLASS_NAME; }
  });

  /**
   * The name of the model. However, it can be hidden by a model property with the same name.
   *
   * @name EditableRootObject#$modelName
   * @type {string}
   * @readonly
   */
  EditableRootObject.prototype.$modelName = name;

  //region Factory methods

  /**
   * Creates a new editable business object instance.
   *
   * @function EditableRootObject.create
   * @param {bo.shared.EventHandlerList} [eventHandlers] - The event handlers of the instance.
   * @param {external.cbDataPortal} callback - Returns a new editable business object.
   *
   * @throws {@link bo.system.ArgumentError Argument error}:
   *      The event handlers must be an EventHandlerList object or null.
   * @throws {@link bo.system.ArgumentError Argument error}:
   *      The callback must be a function.
   * @throws {@link bo.rules.AuthorizationError Authorization error}:
   *      The user has no permission to execute the action.
   * @throws {@link bo.shared.DataPortalError Data portal error}:
   *      Creating the business object has failed.
   */
  EditableRootObject.create = function( eventHandlers ) {
    var instance = new EditableRootObject( eventHandlers );
    return instance.create();
  };

  /**
   * Retrieves an editable business object from the repository.
   *
   * @function EditableRootObject.fetch
   * @param {*} [filter] - The filter criteria.
   * @param {string} [method] - An alternative fetch method of the data access object.
   * @param {bo.shared.EventHandlerList} [eventHandlers] - The event handlers of the instance.
   * @param {external.cbDataPortal} callback - Returns the required editable business object.
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
   *      Fetching the business object has failed.
   */
  EditableRootObject.fetch = function( filter, method, eventHandlers ) {
    var instance = new EditableRootObject( eventHandlers );
    return instance.fetch( filter, method );
  };

  //endregion

  return EditableRootObject;
};

module.exports = EditableRootObjectFactory;
