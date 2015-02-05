'use strict';

//region Imports

var util = require('util');
var config = require('./shared/configuration-reader.js');
var EnsureArgument = require('./system/ensure-argument.js');
var Enumeration = require('./system/enumeration.js');

var ModelBase = require('./model-base.js');
var ModelError = require('./shared/model-error.js');
var ExtensionManagerSync = require('./shared/extension-manager-sync.js');
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
var MODEL_DESC = 'Editable child model';
var M_FETCH = DataPortalAction.getName(DataPortalAction.fetch);

//endregion

/**
 * Factory method to create definitions of synchronous editable child models.
 *
 * @function bo.EditableChildModelSync
 * @param {bo.shared.PropertyManager} properties - The property definitions.
 * @param {bo.shared.RuleManager} rules - The validation and authorization rules.
 * @param {bo.shared.ExtensionManager} extensions - The customization of the model.
 * @returns {EditableChildModelSync} The constructor of a synchronous editable child model.
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The properties must be a PropertyManager object.
 * @throws {@link bo.system.ArgumentError Argument error}: The rules must be a RuleManager object.
 * @throws {@link bo.system.ArgumentError Argument error}: The extensions must be a ExtensionManagerSync object.
 */
var EditableChildModelSyncFactory = function(properties, rules, extensions) {

  properties = EnsureArgument.isMandatoryType(properties, PropertyManager,
      'c_manType', 'EditableChildModelSync', 'properties');
  rules = EnsureArgument.isMandatoryType(rules, RuleManager,
      'c_manType', 'EditableChildModelSync', 'rules');
  extensions = EnsureArgument.isMandatoryType(extensions, ExtensionManagerSync,
      'c_manType', 'EditableChildModelSync', 'extensions');

  // Verify the model types of child models.
  properties.verifyChildTypes([ 'EditableChildCollectionSync', 'EditableChildModelSync' ]);

  /**
   * @classdesc
   *    Represents the definition of a synchronous editable child model.
   * @description
   *    Creates a new synchronous editable child model instance.
   *
   *    _The name of the model type available as:
   *    __&lt;instance&gt;.constructor.modelType__, returns 'EditableChildModelSync'._
   *
   * @name EditableChildModelSync
   * @constructor
   * @param {{}} parent - The parent business object.
   *
   * @extends ModelBase
   *
   * @throws {@link bo.system.ArgumentError Argument error}:
   *    The parent object must be an EditableChildCollectionSync, EditableRootModelSync,
   *    EditableChildModelSync or CommandObjectSync instance.
   *
   * @fires EditableChildModelSync#preCreate
   * @fires EditableChildModelSync#postCreate
   * @fires EditableChildModelSync#preFetch
   * @fires EditableChildModelSync#postFetch
   * @fires EditableChildModelSync#preInsert
   * @fires EditableChildModelSync#postInsert
   * @fires EditableChildModelSync#preUpdate
   * @fires EditableChildModelSync#postUpdate
   * @fires EditableChildModelSync#preRemove
   * @fires EditableChildModelSync#postRemove
   */
  var EditableChildModelSync = function(parent) {
    ModelBase.call(this);

    // Verify the model type of the parent model.
    parent = EnsureArgument.isModelType(parent,
        [
          //'EditableRootCollectionSync',
          'EditableChildCollectionSync',
          'EditableRootModelSync',
          'EditableChildModelSync',
          'CommandObjectSync'
        ],
        'c_modelType', properties.name, 'parent');

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
     * <br/>_This method is usually called by the parent object._
     *
     * @function EditableChildModelSync#toCto
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
     * <br/>_This method is usually called by the parent object._
     *
     * @function EditableChildModelSync#fromCto
     * @param {{}} cto - The client transfer object.
     */
    this.fromCto = function (cto) {
      if (extensions.fromCto)
        extensions.fromCto.call(self, getTransferContext(true), cto);
      else
        baseFromCto(cto);

      properties.children().forEach(function(property) {
        var child = getPropertyValue(property);
        if (cto[property.name]) {
          child.fromCto(cto[property.name]);
        }
      });
    };

    /**
     * Determines that the passed data contains current values of the model key.
     *
     * @function EditableChildModelSync#keyEquals
     * @protected
     * @param {object} data - Data object whose properties can contain the values of the model key.
     * @param {internal~getValue} getPropertyValue - A function that returns
     *    the current value of the given property.
     * @returns {boolean} True when the values are equal, false otherwise.
     */
    this.keyEquals = function (data) {
      return properties.keyEquals(data, getPropertyValue);
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
        propagateChange(); // up to the parent
      }
      else if (state !== MODEL_STATE.created)
        illegal(MODEL_STATE.created);
    }

    function markAsChanged(itself) {
      if (state === MODEL_STATE.pristine) {
        state = MODEL_STATE.changed;
        isDirty = isDirty || itself;
        propagateChange(); // up to the parent
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
        propagateChange(); // up to the parent
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

    function propagateChange() {
      parent.childHasChanged();
    }

    /**
     * Notes that a child object has changed.
     * <br/>_This method is called by child objects._
     *
     * @function EditableChildModelSync#childHasChanged
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
     * @function EditableChildModelSync#getModelState
     * @returns {string} The state of the model.
     */
    this.getModelState = function () {
      return MODEL_STATE.getName(state);
    };

    /**
     * Indicates whether the business object has been created newly and
     * not has been yet saved, i.e. its state is created.
     *
     * @function EditableChildModelSync#isNew
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
     * @function EditableChildModelSync#isDirty
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
     * @function EditableChildModelSync#isSelfDirty
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
     * @function EditableChildModelSync#isDeleted
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
     * @function EditableChildModelSync#isSavable
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

    function fetchChildren(dto) {
      properties.children().forEach(function(property) {
        var child = getPropertyValue(property);
        child.fetch(dto[property.name]);
      });
    }

    function insertChildren(connection) {
      properties.children().forEach(function(property) {
        var child = getPropertyValue(property);
        child.save(connection);
      });
    }

    function updateChildren(connection) {
      properties.children().forEach(function(property) {
        var child = getPropertyValue(property);
        child.save(connection);
      });
    }

    function removeChildren(connection) {
      properties.children().forEach(function(property) {
        var child = getPropertyValue(property);
        child.save(connection);
      });
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

    //endregion

    //region Create

    function data_create () {
      if (extensions.dataCreate || dao.$hasCreate()) {
        var connection = null;
        try {
          // Open connection.
          connection = config.connectionManager.openConnection(extensions.dataSource);
          // Launch start event.
          /**
           * The event arises before the business object instance will be initialized in the repository.
           * @event EditableChildModelSync#preCreate
           * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
           * @param {EditableChildModelSync} oldObject - The instance of the model before the data portal action.
           */
          self.emit(
              DataPortalEvent.getName(DataPortalEvent.preCreate),
              getEventArgs(DataPortalAction.create),
              self
          );
          // Execute creation.
          if (extensions.dataCreate) {
            // *** Custom creation.
            extensions.dataCreate.call(self, getDataContext(connection));
          } else {
            // *** Standard creation.
            var dto = dao.$runMethod('create', connection);
            fromDto.call(self, dto);
          }
          markAsCreated();
          // Launch finish event.
          /**
           * The event arises after the business object instance has been initialized in the repository.
           * @event EditableChildModelSync#postCreate
           * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
           * @param {EditableChildModelSync} newObject - The instance of the model after the data portal action.
           */
          self.emit(
              DataPortalEvent.getName(DataPortalEvent.postCreate),
              getEventArgs(DataPortalAction.create),
              self
          );
          // Close connection.
          connection = config.connectionManager.closeConnection(extensions.dataSource, connection);
        } catch (e) {
          // Wrap the intercepted error.
          var dpError = wrapError(DataPortalAction.create, e);
          // Launch finish event.
          if (connection) {
            self.emit(
                DataPortalEvent.getName(DataPortalEvent.postCreate),
                getEventArgs(DataPortalAction.create, null, dpError),
                self
            );
          }
          // Close connection.
          connection = config.connectionManager.closeConnection(extensions.dataSource, connection);
          // Rethrow error.
          throw dpError;
        }
      }
    }

    //endregion

    //region Fetch

    function data_fetch (data, method) {
      // Check permissions.
      if (method === M_FETCH ? canDo(AuthorizationAction.fetchObject) : canExecute(method)) {
        try {
          // Launch start event.
          /**
           * The event arises before the business object instance will be retrieved from the repository.
           * @event EditableChildModelSync#preFetch
           * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
           * @param {EditableChildModelSync} oldObject - The instance of the model before the data portal action.
           */
          self.emit(
              DataPortalEvent.getName(DataPortalEvent.preFetch),
              getEventArgs(DataPortalAction.fetch, method),
              self
          );
          // Execute fetch.
          var dto = null;
          if (extensions.dataFetch) {
            // *** Custom fetch.
            dto = extensions.dataFetch.call(self, getDataContext(null), data, method);
          } else {
            // *** Standard fetch.
            // Child element gets data from parent.
            dto = data;
            fromDto.call(self, dto);
          }
          // Fetch children as well.
          fetchChildren(dto);
          markAsPristine();
          // Launch finish event.
          /**
           * The event arises after the business object instance has been retrieved from the repository.
           * @event EditableChildModelSync#postFetch
           * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
           * @param {EditableChildModelSync} newObject - The instance of the model after the data portal action.
           */
          self.emit(
              DataPortalEvent.getName(DataPortalEvent.postFetch),
              getEventArgs(DataPortalAction.fetch, method),
              self
          );
        } catch (e) {
          // Wrap the intercepted error.
          var dpError = wrapError(DataPortalAction.fetch, e);
          // Launch finish event.
          self.emit(
              DataPortalEvent.getName(DataPortalEvent.postFetch),
              getEventArgs(DataPortalAction.fetch, method, dpError),
              self
          );
          // Rethrow the original error.
          throw e;
        }
      }
    }

    //endregion

    //region Insert

    function data_insert (connection) {
      // Check permissions.
      if (canDo(AuthorizationAction.createObject)) {
        try {
          // Launch start event.
          /**
           * The event arises before the business object instance will be created in the repository.
           * @event EditableChildModelSync#preInsert
           * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
           * @param {EditableChildModelSync} oldObject - The instance of the model before the data portal action.
           */
          self.emit(
              DataPortalEvent.getName(DataPortalEvent.preInsert),
              getEventArgs(DataPortalAction.insert),
              self
          );
          // Copy the values of parent keys.
          var references = properties.filter(function (property) {
            return property.isParentKey;
          });
          for (var i = 0; i < references.length; i++) {
            var referenceProperty = references[i];
            var parentValue = parent[referenceProperty.name];
            if (parentValue !== undefined)
              setPropertyValue(referenceProperty, parentValue);
          }
          // Execute insert.
          if (extensions.dataInsert) {
            // *** Custom insert.
            extensions.dataInsert.call(self, getDataContext(connection));
          } else {
            // *** Standard insert.
            var dto = toDto.call(self);
            dto = dao.$runMethod('insert', connection, dto);
            fromDto.call(self, dto);
          }
          // Insert children as well.
          insertChildren(connection);
          markAsPristine();
          // Launch finish event.
          /**
           * The event arises after the business object instance has been created in the repository.
           * @event EditableChildModelSync#postInsert
           * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
           * @param {EditableChildModelSync} newObject - The instance of the model after the data portal action.
           */
          self.emit(
              DataPortalEvent.getName(DataPortalEvent.postInsert),
              getEventArgs(DataPortalAction.insert),
              self
          );
        } catch (e) {
          // Wrap the intercepted error.
          var dpError = wrapError(DataPortalAction.insert, e);
          // Launch finish event.
          self.emit(
              DataPortalEvent.getName(DataPortalEvent.postInsert),
              getEventArgs(DataPortalAction.insert, null, dpError),
              self
          );
          // Rethrow the original error.
          throw e;
        }
      }
    }

    //endregion

    //region Update

    function data_update (connection) {
      // Check permissions.
      if (canDo(AuthorizationAction.updateObject)) {
        try {
          // Launch start event.
          /**
           * The event arises before the business object instance will be updated in the repository.
           * @event EditableChildModelSync#preUpdate
           * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
           * @param {EditableChildModelSync} oldObject - The instance of the model before the data portal action.
           */
          self.emit(
              DataPortalEvent.getName(DataPortalEvent.preUpdate),
              getEventArgs(DataPortalAction.update),
              self
          );
          // Execute update.
          if (extensions.dataUpdate) {
            // *** Custom update.
            extensions.dataUpdate.call(self, getDataContext(connection));
          } else if (isDirty) {
            // *** Standard update.
            var dto = toDto.call(self);
            dto = dao.$runMethod('update', connection, dto);
            fromDto.call(self, dto);
          }
          // Update children as well.
          updateChildren(connection);
          markAsPristine();
          // Launch finish event.
          /**
           * The event arises after the business object instance has been updated in the repository.
           * @event EditableChildModelSync#postUpdate
           * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
           * @param {EditableChildModelSync} newObject - The instance of the model after the data portal action.
           */
          self.emit(
              DataPortalEvent.getName(DataPortalEvent.postUpdate),
              getEventArgs(DataPortalAction.update),
              self
          );
        } catch (e) {
          // Wrap the intercepted error.
          var dpError = wrapError(DataPortalAction.update, e);
          // Launch finish event.
          self.emit(
              DataPortalEvent.getName(DataPortalEvent.postUpdate),
              getEventArgs(DataPortalAction.update, null, dpError),
              self
          );
          // Rethrow the original error.
          throw e;
        }
      }
    }

    //endregion

    //region Remove

    function data_remove (connection) {
      // Check permissions.
      if (canDo(AuthorizationAction.removeObject)) {
        try {
          // Launch start event.
          /**
           * The event arises before the business object instance will be removed from the repository.
           * @event EditableChildModelSync#preRemove
           * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
           * @param {EditableChildModelSync} oldObject - The instance of the model before the data portal action.
           */
          self.emit(
              DataPortalEvent.getName(DataPortalEvent.preRemove),
              getEventArgs(DataPortalAction.remove),
              self
          );
          // Remove children first.
          removeChildren(connection);
          // Execute delete.
          if (extensions.dataRemove) {
            // *** Custom removal.
            extensions.dataRemove.call(self, getDataContext(connection));
          } else {
            // *** Standard removal.
            var filter = properties.getKey(getPropertyValue);
            dao.$runMethod('remove', connection, filter);
          }
          markAsRemoved();
          // Launch finish event.
          self.emit(
              DataPortalEvent.getName(DataPortalEvent.postRemove),
              getEventArgs(DataPortalAction.remove),
              self
          );
        } catch (e) {
          // Wrap the intercepted error.
          var dpError = wrapError(DataPortalAction.remove, e);
          // Launch finish event.
          /**
           * The event arises after the business object instance has been removed from the repository.
           * @event EditableChildModelSync#postRemove
           * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
           * @param {EditableChildModelSync} newObject - The instance of the model after the data portal action.
           */
          self.emit(
              DataPortalEvent.getName(DataPortalEvent.postRemove),
              getEventArgs(DataPortalAction.remove, null, dpError),
              self
          );
          // Rethrow the original error.
          throw e;
        }
      }
    }

    //endregion

    //endregion

    //region Actions

    /**
     * Initializes a newly created business object.
     * <br/>_This method is called by the parent object._
     *
     * @function EditableChildModelSync#create
     * @protected
     */
    this.create = function() {
      data_create();
    };

    /**
     * Initializes a business object retrieved from the repository.
     * <br/>_This method is called by the parent object._
     *
     * @function EditableChildModelSync#fetch
     * @protected
     * @param {{}} [data] - The initial data.
     * @param {string} [method] - An alternative fetch method to check for permission.
     */
    this.fetch = function(data, method) {
      data_fetch(data, method || M_FETCH);
    };

    /**
     * Saves the changes of the business object to the repository.
     * <br/>_This method is called by the parent object._
     *
     * @function EditableChildModelSync#save
     * @protected
     * @param {{}} connection - The connection data.
     * @returns {EditableChildModelSync} The business object with the new state after the save.
     */
    this.save = function(connection) {
      if (this.isValid()) {
        switch (state) {
          case MODEL_STATE.created:
            data_insert(connection);
            return this;
          case MODEL_STATE.changed:
            data_update(connection);
            return this;
          case MODEL_STATE.markedForRemoval:
            data_remove(connection);
            return null;
          default:
            return this;
        }
      }
    };

    /**
     * Marks the business object to be deleted from the repository on next save.
     *
     * @function EditableChildModelSync#remove
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
     * <br/>_This method is usually called by the parent object._
     *
     * @function EditableChildModelSync#isValid
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
     * <br/>_This method is usually called by the parent object._
     *
     * @function EditableChildModelSync#checkRules
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
     * <br/>_This method is usually called by the parent object._
     *
     * @function EditableChildModelSync#getBrokenRules
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
          store.initValue(property, property.type.create(self));
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
  util.inherits(EditableChildModelSync, ModelBase);

  /**
   * The name of the model type.
   *
   * @property {string} EditableChildModelSync.constructor.modelType
   * @default EditableChildModelSync
   * @readonly
   */
  Object.defineProperty(EditableChildModelSync, 'modelType', {
    get: function () { return 'EditableChildModelSync'; }
  });
  /**
   * The name of the model. However, it can be hidden by a model property with the same name.
   *
   * @name EditableChildModelSync#$modelName
   * @type {string}
   * @readonly
   */
  EditableChildModelSync.prototype.$modelName = properties.name;

  //region Factory methods

  /**
   * Creates a new editable business object instance.
   * <br/>_This method is called by the parent object._
   *
   * @function EditableChildModelSync.create
   * @protected
   * @param {{}} parent - The parent business object.
   * @returns {EditableChildModelSync} A new editable business object.
   *
   * @throws {@link bo.rules.AuthorizationError Authorization error}:
   *      The user has no permission to execute the action.
   * @throws {@link bo.shared.DataPortalError Data portal error}:
   *    Creating the business object has failed.
   */
  EditableChildModelSync.create = function(parent) {
    var instance = new EditableChildModelSync(parent);
    instance.create();
    return instance;
  };

  /**
   * Initializes an editable business object width data retrieved from the repository.
   * <br/>_This method is called by the parent object._
   *
   * @function EditableChildModelSync.load
   * @protected
   * @param {{}} parent - The parent business object.
   * @param {{}} data - An alternative fetch method of the data access object.
   * @returns {EditableChildModelSync} The required editable business object.
   *
   * @throws {@link bo.rules.AuthorizationError Authorization error}:
   *      The user has no permission to execute the action.
   */
  EditableChildModelSync.load = function(parent, data) {
    var instance = new EditableChildModelSync(parent);
    instance.fetch(data);
    return instance;
  };

  //endregion

  return EditableChildModelSync;
};

module.exports = EditableChildModelSyncFactory;
