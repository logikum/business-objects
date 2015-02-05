'use strict';

//region Imports

var util = require('util');
var config = require('./shared/configuration-reader.js');
var EnsureArgument = require('./system/ensure-argument.js');
var Enumeration = require('./system/enumeration.js');

var ModelBase = require('./model-base.js');
var ModelError = require('./shared/model-error.js');
var ExtensionManager = require('./shared/extension-manager.js');
var DataStore = require('./shared/data-store.js');
var DataType = require('./data-types/data-type.js');

var PropertyInfo = require('./shared/property-info.js');
var PropertyManager = require('./shared/property-manager.js');
var PropertyContext = require('./shared/property-context.js');
var ValidationContext = require('./rules/validation-context.js');
var TransferContext = require('./shared/transfer-context.js');

var RuleManager = require('./rules/rule-manager.js');
var BrokenRuleList = require('./rules/broken-rule-list.js');
var RuleSeverity = require('./rules/rule-severity.js');
var AuthorizationAction = require('./rules/authorization-action.js');
var AuthorizationContext = require('./rules/authorization-context.js');

var DataPortalAction = require('./shared/data-portal-action.js');
var DataPortalContext = require('./shared/data-portal-context.js');
var DataPortalEvent = require('./shared/data-portal-event.js');
var DataPortalEventArgs = require('./shared/data-portal-event-args.js');
var DataPortalError = require('./shared/data-portal-error.js');

var MODEL_STATE = require('./shared/model-state.js');
var MODEL_DESC = 'Editable root model';
var M_FETCH = DataPortalAction.getName(DataPortalAction.fetch);
var E_PRESAVE = DataPortalEvent.getName(DataPortalEvent.preSave);
var E_POSTSAVE = DataPortalEvent.getName(DataPortalEvent.postSave);

//endregion

/**
 * Factory method to create definitions of asynchronous editable root models.
 *
 * @function bo.EditableRootModel
 * @param {bo.shared.PropertyManager} properties - The property definitions.
 * @param {bo.shared.RuleManager} rules - The validation and authorization rules.
 * @param {bo.shared.ExtensionManager} extensions - The customization of the model.
 * @returns {EditableRootModel} The constructor of an asynchronous editable root model.
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The properties must be a PropertyManager object.
 * @throws {@link bo.system.ArgumentError Argument error}: The rules must be a RuleManager object.
 * @throws {@link bo.system.ArgumentError Argument error}: The extensions must be a ExtensionManager object.
 */
var EditableRootModelFactory = function(properties, rules, extensions) {

  properties = EnsureArgument.isMandatoryType(properties, PropertyManager,
      'c_manType', 'EditableRootModel', 'properties');
  rules = EnsureArgument.isMandatoryType(rules, RuleManager,
      'c_manType', 'EditableRootModel', 'rules');
  extensions = EnsureArgument.isMandatoryType(extensions, ExtensionManager,
      'c_manType', 'EditableRootModel', 'extensions');

  // Verify the model types of child models.
  properties.verifyChildTypes([ 'EditableChildCollection', 'EditableChildModel' ]);

  /**
   * @classdesc
   *    Represents the definition of an asynchronous editable root model.
   * @description
   *    Creates a new asynchronous editable root model instance.
   *
   *    _The name of the model type available as:
   *    __&lt;instance&gt;.constructor.modelType__, returns 'EditableRootModel'._
   *
   * @name EditableRootModel
   * @constructor
   *
   * @extends ModelBase
   *
   * @fires EditableRootModel#preCreate
   * @fires EditableRootModel#postCreate
   * @fires EditableRootModel#preFetch
   * @fires EditableRootModel#postFetch
   * @fires EditableRootModel#preInsert
   * @fires EditableRootModel#postInsert
   * @fires EditableRootModel#preUpdate
   * @fires EditableRootModel#postUpdate
   * @fires EditableRootModel#preRemove
   * @fires EditableRootModel#postRemove
   * @fires EditableRootModel#preSave
   * @fires EditableRootModel#postSave
   */
  var EditableRootModel = function() {
    ModelBase.call(this);

    var self = this;
    var state = null;
    var isDirty = false;
    var store = new DataStore();
    var brokenRules = new BrokenRuleList(properties.name);
    var isValidated = false;
    var dao = null;
    var propertyContext = null;
    var dataContext = null;

    // Set up business rules.
    rules.initialize(config.noAccessBehavior);

    // Get data access object.
    if (extensions.daoBuilder)
      dao = extensions.daoBuilder(extensions.dataSource, extensions.modelPath);
    else
      dao = config.daoBuilder(extensions.dataSource, extensions.modelPath);

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
     * @function EditableRootModel#toCto
     * @returns {{}} The client transfer object.
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
     * @function EditableRootModel#fromCto
     * @param {{}} cto - The client transfer object.
     */
    this.fromCto = function (cto) {
      if (extensions.fromCto)
        extensions.fromCto.call(self, getTransferContext(true), cto);
      else
        baseFromCto(cto);

      properties.children().forEach(function (property) {
        var child = getPropertyValue(property);
        if (cto[property.name]) {
          child.fromCto(cto[property.name]);
        }
      });
    };

    //endregion

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
     * Notes that a child object has changed. This method is called by the child objects.
     *
     * @function EditableRootModel#childHasChanged
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
     * @function EditableRootModel#getModelState
     * @returns {string} The state of the model.
     */
    this.getModelState = function () {
      return MODEL_STATE.getName(state);
    };

    /**
     * Indicates whether the business object has been created newly and
     * not has been yet saved, i.e. its state is created.
     *
     * @function EditableRootModel#isNew
     * @returns {boolean} True when the business object is new, otherwise false.
     */
    Object.defineProperty(this, 'isNew', {
      get: function () {
        return state === MODEL_STATE.created;
      }
    });

    /**
     * Indicates whether the business object itself or any of its child objects differs the one
     * that is stored in the repository, i.e. its state is created, changed or markedForRemoval.
     *
     * @function EditableRootModel#isDirty
     * @returns {boolean} True when the business object has been changed, otherwise false.
     */
    Object.defineProperty(this, 'isDirty', {
      get: function () {
        return state === MODEL_STATE.created ||
            state === MODEL_STATE.changed ||
            state === MODEL_STATE.markedForRemoval;
      }
    });

    /**
     * Indicates whether the business object itself, ignoring its child objects, differs the one
     * that is stored in the repository.
     *
     * @function EditableRootModel#isSelfDirty
     * @returns {boolean} True when the business object itself has been changed, otherwise false.
     */
    Object.defineProperty(this, 'isSelfDirty', {
      get: function () {
        return isDirty;
      }
    });

    /**
     * Indicates whether the business object will be deleted from the repository,
     * i.e. its state is markedForRemoval.
     *
     * @function EditableRootModel#isDeleted
     * @returns {boolean} True when the business object will be deleted, otherwise false.
     */
    Object.defineProperty(this, 'isDeleted', {
      get: function () {
        return state === MODEL_STATE.markedForRemoval;
      }
    });

    /**
     * Indicates whether the business object can be saved to the repository,
     * i.e. it has ben changed and is valid, and the user has permission to save it.
     *
     * @function EditableRootModel#isSavable
     * @returns {boolean} True when the user can save the business object, otherwise false.
     */
    Object.defineProperty(this, 'isSavable', {
      get: function () {
        var auth;
        if (self.isDeleted())
          auth = canDo(AuthorizationAction.removeObject);
        else if (self.isNew())
          auth = canDo(AuthorizationAction.createObject);
        else
          auth = canDo(AuthorizationAction.updateObject);
        return auth && self.isDirty() && self.isValid();
      }
    });

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

    function getEventArgs (action, methodName, error) {
      return new DataPortalEventArgs(properties.name, action, methodName, error);
    }

    function wrapError (action, error) {
      return new DataPortalError(MODEL_DESC, properties.name, action, error);
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
         * @event EditableRootModel#postCreate
         * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
         * @param {EditableRootModel} newObject - The instance of the model after the data portal action.
         */
        self.emit(
            DataPortalEvent.getName(DataPortalEvent.postCreate),
            getEventArgs(DataPortalAction.create),
            self
        );
        cb(null, self);
      }
      // Helper callback for failure.
      function failed (err, cb) {
        if (hasConnection) {
          // Launch finish event.
          var dpError = wrapError(DataPortalAction.create, err);
          self.emit(
              DataPortalEvent.getName(DataPortalEvent.postCreate),
              getEventArgs(DataPortalAction.create, null, dpError),
              self
          );
        }
        cb(err);
      }
      // Main activity.
      function main (connection, cb) {
        hasConnection = connection !== null;
        // Launch start event.
        /**
         * The event arises before the business object instance will be initialized in the repository.
         * @event EditableRootModel#preCreate
         * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
         * @param {EditableRootModel} oldObject - The instance of the model before the data portal action.
         */
        self.emit(
            DataPortalEvent.getName(DataPortalEvent.preCreate),
            getEventArgs(DataPortalAction.create),
            self
        );
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
             * @event EditableRootModel#postFetch
             * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
             * @param {EditableRootModel} newObject - The instance of the model after the data portal action.
             */
            self.emit(
                DataPortalEvent.getName(DataPortalEvent.postFetch),
                getEventArgs(DataPortalAction.fetch, method),
                self
            );
            cb(null, self);
          }
        });
      }
      // Helper callback for failure.
      function failed (err, cb) {
        if (hasConnection) {
          // Launch finish event.
          var dpError = wrapError(DataPortalAction.fetch, err);
          self.emit(
              DataPortalEvent.getName(DataPortalEvent.postFetch),
              getEventArgs(DataPortalAction.fetch, method, dpError),
              self
          );
        }
        cb(err);
      }
      // Main activity.
      function main (connection, cb) {
        hasConnection = connection !== null;
        // Launch start event.
        /**
         * The event arises before the business object instance will be retrieved from the repository.
         * @event EditableRootModel#preFetch
         * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
         * @param {EditableRootModel} oldObject - The instance of the model before the data portal action.
         */
        self.emit(
            DataPortalEvent.getName(DataPortalEvent.preFetch),
            getEventArgs(DataPortalAction.fetch, method),
            self
        );
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
             * @event EditableRootModel#postInsert
             * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
             * @param {EditableRootModel} newObject - The instance of the model after the data portal action.
             */
            self.emit(
                DataPortalEvent.getName(DataPortalEvent.postInsert),
                getEventArgs(DataPortalAction.insert),
                self
            );
            self.emit(E_POSTSAVE, getEventArgs(DataPortalAction.insert), self);
            cb(null, self);
          }
        });
      }
      // Helper callback for failure.
      function failed (err, cb) {
        if (hasConnection) {
          // Launch finish event.
          var dpError = wrapError(DataPortalAction.insert, err);
          self.emit(
              DataPortalEvent.getName(DataPortalEvent.postInsert),
              getEventArgs(DataPortalAction.insert, null, dpError),
              self
          );
          self.emit(E_POSTSAVE, getEventArgs(DataPortalAction.insert, null, dpError), self);
        }
        cb(err);
      }
      // Main activity.
      function main (connection, cb) {
        hasConnection = connection !== null;
        // Launch start event.
        self.emit(E_PRESAVE, getEventArgs(DataPortalAction.insert), self);
        /**
         * The event arises before the business object instance will be created in the repository.
         * @event EditableRootModel#preInsert
         * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
         * @param {EditableRootModel} oldObject - The instance of the model before the data portal action.
         */
        self.emit(
            DataPortalEvent.getName(DataPortalEvent.preInsert),
            getEventArgs(DataPortalAction.insert),
            self
        );
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
             * @event EditableRootModel#postUpdate
             * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
             * @param {EditableRootModel} newObject - The instance of the model after the data portal action.
             */
            self.emit(
                DataPortalEvent.getName(DataPortalEvent.postUpdate),
                getEventArgs(DataPortalAction.update),
                self
            );
            self.emit(E_POSTSAVE, getEventArgs(DataPortalAction.update), self);
            cb(null, self);
          }
        });
      }
      // Helper callback for failure.
      function failed (err, cb) {
        if (hasConnection) {
          // Launch finish event.
          var dpError = wrapError(DataPortalAction.update, err);
          self.emit(
              DataPortalEvent.getName(DataPortalEvent.postUpdate),
              getEventArgs(DataPortalAction.update, null, dpError),
              self
          );
          self.emit(E_POSTSAVE, getEventArgs(DataPortalAction.update, null, dpError), self);
        }
        cb(err);
      }
      // Main activity.
      function main (connection, cb) {
        hasConnection = connection !== null;
        // Launch start event.
        self.emit(E_PRESAVE, getEventArgs(DataPortalAction.update), self);
        /**
         * The event arises before the business object instance will be updated in the repository.
         * @event EditableRootModel#preUpdate
         * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
         * @param {EditableRootModel} oldObject - The instance of the model before the data portal action.
         */
        self.emit(
            DataPortalEvent.getName(DataPortalEvent.preUpdate),
            getEventArgs(DataPortalAction.update),
            self
        );
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
         * @event EditableRootModel#postRemove
         * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
         * @param {EditableRootModel} newObject - The instance of the model after the data portal action.
         */
        self.emit(
            DataPortalEvent.getName(DataPortalEvent.postRemove),
            getEventArgs(DataPortalAction.remove),
            self
        );
        self.emit(E_POSTSAVE, getEventArgs(DataPortalAction.remove), self);
        cb(null, null);
      }
      // Helper callback for failure.
      function failed (err, cb) {
        if (hasConnection) {
          // Launch finish event.
          var dpError = wrapError(DataPortalAction.remove, err);
          self.emit(
              DataPortalEvent.getName(DataPortalEvent.postRemove),
              getEventArgs(DataPortalAction.remove, null, dpError),
              self
          );
          self.emit(E_POSTSAVE, getEventArgs(DataPortalAction.remove, null, dpError), self);
        }
        cb(err);
      }
      // Main activity.
      function main (connection, cb) {
        hasConnection = connection !== null;
        // Launch start event.
        self.emit(E_PRESAVE, getEventArgs(DataPortalAction.remove), self);
        /**
         * The event arises before the business object instance will be removed from the repository.
         * @event EditableRootModel#preRemove
         * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
         * @param {EditableRootModel} oldObject - The instance of the model before the data portal action.
         */
        self.emit(
            DataPortalEvent.getName(DataPortalEvent.preRemove),
            getEventArgs(DataPortalAction.remove),
            self
        );
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
     * It is called by a factory method with the same name.
     *
     * @function EditableRootModel#create
     * @protected
     * @param {external~cbDataPortal} callback - Returns a new editable business object.
     */
    this.create = function(callback) {
      data_create(callback);
    };

    /**
     * Initializes a business object to be retrieved from the repository.
     * It is called by a factory method with the same name.
     *
     * @function EditableRootModel#fetch
     * @protected
     * @param {*} [filter] - The filter criteria.
     * @param {string} [method] - An alternative fetch method of the data access object.
     * @param {external~cbDataPortal} callback - Returns the required editable business object.
     */
    this.fetch = function(filter, method, callback) {
      data_fetch(filter, method || M_FETCH, callback);
    };

    /**
     * Saves the changes of the business object to the repository.
     *
     * @function EditableRootModel#save
     * @param {external~cbDataPortal} callback - The business object with the new state after the save.
     */
    this.save = function(callback) {
      if (this.isValid()) {
        /**
         * The event arises before the business object instance will be saved in the repository.
         * The event is followed by a preInsert, preUpdate or preRemove event depending on the
         * state of the business object instance.
         * @event EditableRootModel#preSave
         * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
         * @param {EditableRootModel} oldObject - The instance of the model before the data portal action.
         */
        switch (state) {
          case MODEL_STATE.created:
            data_insert(callback);
            break;
          case MODEL_STATE.changed:
            data_update(callback);
            break;
          case MODEL_STATE.markedForRemoval:
            data_remove(callback);
            break;
          default:
            callback(null, this);
        }
        /**
         * The event arises after the business object instance has been saved in the repository.
         * The event is preceded by a postInsert, postUpdate or postRemove event depending on the
         * state of the business object instance.
         * @event EditableRootModel#postSave
         * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
         * @param {EditableRootModel} newObject - The instance of the model after the data portal action.
         */
      }
    };

    /**
     * Marks the business object to be deleted from the repository on next save.
     *
     * @function EditableRootModel#remove
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
     * @function EditableRootModel#isValid
     * @returns {boolean} True when the business object is valid, otherwise false.
     */
    this.isValid = function() {
      if (!isValidated)
        this.checkRules();

      return brokenRules.isValid();
    };

    /**
     * Executes all the validation rules of the business object, including the ones
     * of its child objects.
     *
     * @function EditableRootModel#checkRules
     */
    this.checkRules = function() {
      brokenRules.clear();

      properties.forEach(function(property) {
        validate(property);
      });
      isValidated = true;
    };

    function validate(property) {
      rules.validate(property, new ValidationContext(getPropertyValue, brokenRules));
    }

    /**
     * Gets the broken rules of the business object.
     *
     * @function EditableRootModel#getBrokenRules
     * @param {string} [namespace] - The namespace of the message keys when messages are localizable.
     * @returns {bo.rules.BrokenRulesOutput} The broken rules of the business object.
     */
    this.getBrokenRules = function(namespace) {
      return brokenRules.output(namespace);
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
      if (canBeRead(property))
        return store.getValue(property);
      else
        return null;
    }

    function writePropertyValue(property, value) {
      if (canBeWritten(property)) {
        if (store.setValue(property, value))
          markAsChanged(true);
      }
    }

    function getPropertyContext(primaryProperty) {
      if (!propertyContext)
        propertyContext = new PropertyContext(properties.toArray(), readPropertyValue, writePropertyValue);
      return propertyContext.with(primaryProperty);
    }

    properties.map(function(property) {

      if (property.type instanceof DataType) {
        // Normal property
        store.initValue(property);

        Object.defineProperty(self, property.name, {
          get: function () {
            if (property.getter)
              return property.getter(getPropertyContext(property));
            else
              return readPropertyValue(property);
          },
          set: function (value) {
            if (property.isReadOnly)
              throw new ModelError('readOnly', properties.name , property.name);
            if (property.setter)
              property.setter(getPropertyContext(property), value);
            else
              writePropertyValue(property, value);
          },
          enumerable: true
        });

      } else {
        // Child item/collection
        if (property.type.create) // Item
          property.type.create(self, function (err, item) {
            store.initValue(property, item);
          });
        else                      // Collection
          store.initValue(property, new property.type(self));

        Object.defineProperty(self, property.name, {
          get: function () {
            return readPropertyValue(property);
          },
          set: function (value) {
            throw new ModelError('readOnly', properties.name , property.name);
          },
          enumerable: false
        });
      }
    });

    //endregion

    // Immutable object.
    Object.freeze(this);
  };
  util.inherits(EditableRootModel, ModelBase);

  /**
   * The name of the model type.
   *
   * @property {string} EditableRootModel.constructor.modelType
   * @default EditableRootModel
   * @readonly
   */
  Object.defineProperty(EditableRootModel, 'modelType', {
    get: function () { return 'EditableRootModel'; }
  });
  /**
   * The name of the model. However, it can be hidden by a model property with the same name.
   *
   * @name EditableRootModel#$modelName
   * @type {string}
   * @readonly
   */
  EditableRootModel.prototype.$modelName = properties.name;

  //region Factory methods

  /**
   * Creates a new editable business object instance.
   *
   * @function EditableRootModel.create
   * @param {external~cbDataPortal} callback - Returns a new editable business object.
   *
   * @throws {@link bo.rules.AuthorizationError Authorization error}:
   *      The user has no permission to execute the action.
   * @throws {@link bo.shared.DataPortalError Data portal error}:
   *    Creating the business object has failed.
   */
  EditableRootModel.create = function(callback) {
    var instance = new EditableRootModel();
    instance.create(function (err) {
      if (err)
        callback(err);
      else
        callback(null, instance);
    });
  };

  /**
   * Retrieves an editable business object from the repository.
   *
   * @function EditableRootModel.fetch
   * @param {*} [filter] - The filter criteria.
   * @param {string} [method] - An alternative fetch method of the data access object.
   * @param {external~cbDataPortal} callback - Returns the required editable business object.
   *
   * @throws {@link bo.rules.AuthorizationError Authorization error}:
   *      The user has no permission to execute the action.
   * @throws {@link bo.shared.DataPortalError Data portal error}:
   *    Fetching the business object has failed.
   */
  EditableRootModel.fetch = function(filter, method, callback) {
    if (!callback) {
      callback = method;
      method = undefined;
    }
    var instance = new EditableRootModel();
    instance.fetch(filter, method, function (err) {
      if (err)
        callback(err);
      else
        callback(null, instance);
    });
  };

  //endregion

  return EditableRootModel;
};

module.exports = EditableRootModelFactory;
