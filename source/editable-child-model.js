'use strict';

//region Imports

var util = require('util');
var config = require('./shared/configuration-reader.js');
var EnsureArgument = require('./shared/ensure-argument.js');
var Enumeration = require('./shared/enumeration.js');

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
var Action = require('./rules/authorization-action.js');
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
 * Factory method to create definitions of asynchronous editable child models.
 *
 * @function bo.EditableChildModel
 * @param {bo.shared.PropertyManager} properties - The property definitions.
 * @param {bo.shared.RuleManager} rules - The validation and authorization rules.
 * @param {bo.shared.ExtensionManager} extensions - The customization of the model.
 * @returns {EditableChildModel} The constructor of an asynchronous editable child model.
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The properties must be a PropertyManager object.
 * @throws {@link bo.system.ArgumentError Argument error}: The rules must be a RuleManager object.
 * @throws {@link bo.system.ArgumentError Argument error}: The extensions must be a ExtensionManager object.
 */
var EditableChildModelFactory = function(properties, rules, extensions) {

  properties = EnsureArgument.isMandatoryType(properties, PropertyManager,
      'c_manType', 'EditableChildModel', 'properties');
  rules = EnsureArgument.isMandatoryType(rules, RuleManager,
      'c_manType', 'EditableChildModel', 'rules');
  extensions = EnsureArgument.isMandatoryType(extensions, ExtensionManager,
      'c_manType', 'EditableChildModel', 'extensions');

  // Verify the model types of child models.
  properties.verifyChildTypes([ 'EditableChildCollection', 'EditableChildModel' ]);

  /**
   * @classdesc Represents the definition of an asynchronous editable child model.
   * @description Creates a new asynchronous editable child model instance.
   *
   * @name EditableChildModel
   * @constructor
   *
   * @extends ModelBase
   */
  var EditableChildModel = function(parent) {
    ModelBase.call(this);

    // Verify the model type of the parent model.
    parent = EnsureArgument.isModelType(parent,
        [
          //'EditableRootCollection',
          'EditableChildCollection',
          'EditableRootModel',
          'EditableChildModel',
          'CommandObject'
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

    this.getModelState = function () {
      return MODEL_STATE.getName(state);
    };

    Object.defineProperty(this, 'isNew', {
      get: function () {
        return state === MODEL_STATE.created;
      }
    });

    Object.defineProperty(this, 'isDirty', {
      get: function () {
        return state === MODEL_STATE.created ||
            state === MODEL_STATE.changed ||
            state === MODEL_STATE.markedForRemoval;
      }
    });

    Object.defineProperty(this, 'isSelfDirty', {
      get: function () {
        return isDirty;
      }
    });

    Object.defineProperty(this, 'isDeleted', {
      get: function () {
        return state === MODEL_STATE.markedForRemoval;
      }
    });

    Object.defineProperty(this, 'isSavable', {
      get: function () {
        var auth;
        if (self.isDeleted())
          auth = canDo(Action.removeObject);
        else if (self.isNew())
          auth = canDo(Action.createObject);
        else
          auth = canDo(Action.updateObject);
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
          getAuthorizationContext(Action.readProperty, property.name)
      );
    }

    function canBeWritten (property) {
      return rules.hasPermission(
          getAuthorizationContext(Action.writeProperty, property.name)
      );
    }

    function canDo (action) {
      return rules.hasPermission(
          getAuthorizationContext(action)
      );
    }

    function canExecute (methodName) {
      return rules.hasPermission(
          getAuthorizationContext(Action.executeMethod, methodName)
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

    function data_create (callback) {
      var hasConnection = false;
      // Helper callback for post-creation actions.
      function finish (cb) {
        markAsCreated();
        // Launch finish event.
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

    function data_fetch (filter, method, callback) {
      // Helper function for post-fetch actions.
      function finish (dto, cb) {
        // Fetch children as well.
        fetchChildren(dto, function (err) {
          if (err)
            failed(err, cb);
          else {
            markAsPristine();
            // Launch finish event.
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
        // Launch finish event.
        var dpError = wrapError(DataPortalAction.fetch, err);
        self.emit(
            DataPortalEvent.getName(DataPortalEvent.postFetch),
            getEventArgs(DataPortalAction.fetch, method, dpError),
            self
        );
        cb(err);
      }
      // Check permissions.
      if (method === M_FETCH ? canDo(Action.fetchObject) : canExecute(method)) {
        // Launch start event.
        self.emit(
            DataPortalEvent.getName(DataPortalEvent.preFetch),
            getEventArgs(DataPortalAction.fetch, method),
            self
        );
        // Execute fetch.
        if (extensions.dataFetch) {
          // *** Custom fetch.
          extensions.dataFetch.call(self, getDataContext(null), filter, method, function (err, dto) {
            if (err)
              failed(err, callback);
            else
              finish(dto, callback);
          });
        } else {
          // *** Standard fetch.
          // Child element gets data from parent.
          fromDto.call(self, filter);
          finish(filter, callback);
        }
      } else
        callback(null, self);
    }

    function data_insert (connection, callback) {
      // Helper function for post-insert actions.
      function finish (conn, cb) {
        // Insert children as well.
        insertChildren(conn, function (err) {
          if (err)
            failed(err, cb);
          else {
            markAsPristine();
            // Launch finish event.
            self.emit(
                DataPortalEvent.getName(DataPortalEvent.postInsert),
                getEventArgs(DataPortalAction.insert),
                self
            );
            cb(null, self);
          }
        });
      }
      // Helper callback for failure.
      function failed (err, cb) {
        // Launch finish event.
        var dpError = wrapError(DataPortalAction.insert, err);
        self.emit(
            DataPortalEvent.getName(DataPortalEvent.postInsert),
            getEventArgs(DataPortalAction.insert, null, dpError),
            self
        );
        cb(err);
      }
      // Main activity.
      function main (conn, cb) {
        // Launch start event.
        self.emit(
            DataPortalEvent.getName(DataPortalEvent.preInsert),
            getEventArgs(DataPortalAction.insert),
            self
        );
        // Execute insert.
        if (extensions.dataInsert) {
          // *** Custom insert.
          extensions.dataInsert.call(self, getDataContext(conn), function (err) {
            if (err)
              failed(err, cb);
            else
              finish(conn, cb);
          });
        } else {
          // *** Standard insert.
          var dto = toDto.call(self);
          dao.$runMethod('insert', conn, dto, function (err, dto) {
            if (err)
              failed(err, cb);
            else {
              fromDto.call(self, dto);
              finish(conn, cb);
            }
          });
        }
      }
      // Check permissions.
      if (canDo(Action.createObject)) {
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
        main(connection, callback);
      } else
        callback(null, self);
    }

    function data_update (connection, callback) {
      // Helper function for post-update actions.
      function finish (conn, cb) {
        // Update children as well.
        updateChildren(conn, function (err) {
          if (err)
            failed(err, cb);
          else {
            markAsPristine();
            // Launch finish event.
            self.emit(
                DataPortalEvent.getName(DataPortalEvent.postUpdate),
                getEventArgs(DataPortalAction.update),
                self
            );
            cb(null, self);
          }
        });
      }
      // Helper callback for failure.
      function failed (err, cb) {
        // Launch finish event.
        var dpError = wrapError(DataPortalAction.update, err);
        self.emit(
            DataPortalEvent.getName(DataPortalEvent.postUpdate),
            getEventArgs(DataPortalAction.update, null, dpError),
            self
        );
        cb(err);
      }
      // Main activity.
      function main (conn, cb) {
        // Launch start event.
        self.emit(
            DataPortalEvent.getName(DataPortalEvent.preUpdate),
            getEventArgs(DataPortalAction.update),
            self
        );
        // Execute update.
        if (extensions.dataUpdate) {
          // *** Custom update.
          extensions.dataUpdate.call(self, getDataContext(conn), function (err) {
            if (err)
              failed(err, cb);
            else
              finish(conn, cb);
          });
        } else if (isDirty) {
          // *** Standard update.
          var dto = toDto.call(self);
          dao.$runMethod('update', conn, dto, function (err, dto) {
            if (err)
              failed(err, cb);
            else {
              fromDto.call(self, dto);
              finish(conn, cb);
            }
          });
        } else {
          // Update children only.
          finish(conn, cb);
        }
      }
      // Check permissions.
      if (canDo(Action.updateObject))
        main(connection, callback);
      else
        callback(null, self);
    }

    function data_remove (connection, callback) {
      // Helper callback for post-removal actions.
      function finish (cb) {
        markAsRemoved();
        // Launch finish event.
        self.emit(
            DataPortalEvent.getName(DataPortalEvent.postRemove),
            getEventArgs(DataPortalAction.remove),
            self
        );
        cb(null, null);
      }
      // Helper callback for failure.
      function failed (err, cb) {
        // Launch finish event.
        var dpError = wrapError(DataPortalAction.remove, err);
        self.emit(
            DataPortalEvent.getName(DataPortalEvent.postRemove),
            getEventArgs(DataPortalAction.remove, null, dpError),
            self
        );
        cb(err);
      }
      // Main activity.
      function main (conn, cb) {
        // Launch start event.
        self.emit(
            DataPortalEvent.getName(DataPortalEvent.preRemove),
            getEventArgs(DataPortalAction.remove),
            self
        );
        // Remove children first.
        removeChildren(conn, function (err) {
          if (err)
            failed(err, cb);
          else {
            // Execute removal.
            if (extensions.dataRemove) {
              // *** Custom removal.
              extensions.dataRemove.call(self, getDataContext(conn), function (err) {
                if (err)
                  failed(err, cb);
                else
                  finish(cb);
              });
            } else {
              // *** Standard removal.
              var filter = properties.getKey(getPropertyValue);
              dao.$runMethod('remove', conn, filter, function (err) {
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
      if (canDo(Action.removeObject))
        main(connection, callback);
      else
        callback(null);
    }

    //endregion

    //region Actions

    this.create = function(callback) {
      data_create(callback);
    };

    this.fetch = function(filter, method, callback) {
      data_fetch(filter, method || M_FETCH, callback);
    };

    this.save = function(connection, callback) {
      if (this.isValid()) {
        switch (state) {
          case MODEL_STATE.created:
            data_insert(connection, callback);
            break;
          case MODEL_STATE.changed:
            data_update(connection, callback);
            break;
          case MODEL_STATE.markedForRemoval:
            data_remove(connection, callback);
            break;
          default:
            callback(null, this);
        }
      }
    };

    this.remove = function() {
      markForRemoval();
    };

    //endregion

    //region Validation

    this.isValid = function() {
      if (!isValidated)
        this.checkRules();

      return brokenRules.isValid();
    };

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
  util.inherits(EditableChildModel, ModelBase);

  EditableChildModel.modelType = 'EditableChildModel';
  EditableChildModel.prototype.name = properties.name;

  //region Factory methods

  EditableChildModel.create = function(parent, callback) {
    var instance = new EditableChildModel(parent);
    instance.create(function (err) {
      if (err)
        callback(err);
      else
        callback(null, instance);
    });
  };

  EditableChildModel.load = function(parent, data, callback) {
    var instance = new EditableChildModel(parent);
    instance.fetch(data, undefined, function (err) {
      if (err)
        callback(err);
      else
        callback(null, instance);
    });
  };

  //endregion

  return EditableChildModel;
};

module.exports = EditableChildModelFactory;
