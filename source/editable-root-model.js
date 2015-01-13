/**
 * Asynchronous editable root model module.
 * @module editable-root-model
 */
'use strict';

var util = require('util');
var ModelBase = require('./model-base.js');
var config = require('./shared/config-reader.js');
var ensureArgument = require('./shared/ensure-argument.js');
var ModelError = require('./shared/model-error.js');

var DataType = require('./data-types/data-type.js');
var Enumeration = require('./shared/enumeration.js');
var PropertyInfo = require('./shared/property-info.js');
var PropertyManager = require('./shared/property-manager.js');
var ExtensionManager = require('./shared/extension-manager.js');
var DataStore = require('./shared/data-store.js');
var DataContext = require('./shared/data-context.js');
var TransferContext = require('./shared/transfer-context.js');
var RuleManager = require('./rules/rule-manager.js');
var BrokenRuleList = require('./rules/broken-rule-list.js');
var RuleSeverity = require('./rules/rule-severity.js');
var Action = require('./rules/authorization-action.js');
var AuthorizationContext = require('./rules/authorization-context.js');
var ValidationContext = require('./rules/validation-context.js');

var MODEL_STATE = require('./shared/model-state.js');

var EditableRootModelCreator = function(properties, rules, extensions) {

  properties = ensureArgument.isMandatoryType(properties, PropertyManager,
      'c_manType', 'EditableRootModelCreator', 'properties');
  rules = ensureArgument.isMandatoryType(rules, RuleManager,
      'c_manType', 'EditableRootModelCreator', 'rules');
  extensions = ensureArgument.isMandatoryType(extensions, ExtensionManager,
      'c_manType', 'EditableRootModelCreator', 'extensions');

  var EditableRootModel = function() {

    var self = this;
    var state = null;
    var isDirty = false;
    var store = new DataStore();
    var brokenRules = new BrokenRuleList(properties.name);
    var isValidated = false;
    var dao = null;
    var user = null;
    var dataContext = null;
    var xferContext = null;

    // Set up business rules.
    rules.initialize(config.noAccessBehavior);

    // Get data access object.
    if (extensions.daoBuilder)
      dao = extensions.daoBuilder(extensions.dataSource, extensions.modelPath);
    else
      dao = config.daoBuilder(extensions.dataSource, extensions.modelPath);

    // Get principal.
    user = config.getUser();

    //region Transfer object methods

    function getTransferContext () {
      if (!xferContext)
        xferContext = new TransferContext(properties.toArray(), getPropertyValue, setPropertyValue);
      return xferContext;
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
        return extensions.toDto.call(self, getTransferContext());
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
        extensions.fromDto.call(self, getTransferContext(), dto);
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
        cto = extensions.toCto.call(self, getTransferContext());
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
        extensions.fromCto.call(self, getTransferContext(), cto);
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
      return new AuthorizationContext(action, targetName || '', user, brokenRules);
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

    function insertChildren(callback) {
      saveChildren(callback);
    }

    function updateChildren(callback) {
      saveChildren(callback);
    }

    function removeChildren(callback) {
      saveChildren(callback);
    }

    function saveChildren(callback) {
      var count = 0;
      var error = null;

      if (properties.childCount()) {
        properties.children().forEach(function (property) {
          var child = getPropertyValue(property);
          child.save(function (err) {
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

    function getDataContext() {
      if (!dataContext)
        dataContext = new DataContext(
            dao, user, false, properties.toArray(), getPropertyValue, setPropertyValue
        );
      return dataContext.setSelfDirty(isDirty);
    }

    function data_create (callback) {
      if (extensions.dataCreate) {
        // Custom create.
        extensions.dataCreate.call(self, getDataContext(), function (err) {
          if (err)
            callback(err);
          else {
            markAsCreated();
            callback(null, self);
          }
        });
      } else {
        // Standard create.
        dao.checkMethod('create');
        dao.create(function (err, dto) {
          if (err)
            callback(err);
          else {
            fromDto.call(self, dto);
            markAsCreated();
            callback(null, self);
          }
        });
      }
    }

    function data_fetch (filter, method, callback) {
      // Helper function for post-fetch actions.
      function finish (dto) {
        // Fetch children as well.
        fetchChildren(dto, function (err) {
          if (err) {
            callback(err);
          } else {
            markAsPristine();
            callback(null, self);
          }
        });
      }
      // Check permissions.
      if (method === 'fetch' ? canDo(Action.fetchObject) : canExecute(method)) {
        if (extensions.dataFetch) {
          // Custom fetch.
          extensions.dataFetch.call(self, getDataContext(), filter, method, function (err, dto) {
            if (err)
              callback(err);
            else
              finish(dto);
          });
        } else {
          // Standard fetch.
          // Root element fetches data from repository.
          dao.checkMethod(method);
          dao[method](filter, function (err, dto) {
            if (err) {
              callback(err);
            } else {
              fromDto.call(self, dto);
              finish(dto);
            }
          });
        }
      } else
        callback(null, self);
    }

    function data_insert (callback) {
      // Helper function for post-insert actions.
      function finish () {
        // Insert children as well.
        insertChildren(function (err) {
          if (err) {
            callback(err);
          } else {
            markAsPristine();
            callback(null, self);
          }
        });
      }
      // Check permissions.
      if (canDo(Action.createObject)) {
        if (extensions.dataInsert) {
          // Custom insert.
          extensions.dataInsert.call(self, getDataContext(), function (err) {
            if (err)
              callback(err);
            else
              finish();
          });
        } else {
          // Standard insert.
          var dto = toDto.call(self);
          dao.checkMethod('insert');
          dao.insert(dto, function (err, dto) {
            if (err) {
              callback(err);
            } else {
              fromDto.call(self, dto);
              finish();
            }
          });
        }
      } else
        callback(null, self);
    }

    function data_update (callback) {
      // Helper function for post-update actions.
      function finish () {
        // Update children as well.
        updateChildren(function (err) {
          if (err) {
            callback(err);
          } else {
            markAsPristine();
            callback(null, self);
          }
        });
      }
      // Check permissions.
      if (canDo(Action.updateObject)) {
        if (extensions.dataUpdate) {
          // Custom update.
          extensions.dataUpdate.call(self, getDataContext(), function (err) {
            if (err)
              callback(err);
            else
              finish();
          });
        } else if (isDirty) {
          // Standard update.
          var dto = toDto.call(self);
          dao.checkMethod('update');
          dao.update(dto, function (err, dto) {
            if (err) {
              callback(err);
            } else {
              fromDto.call(self, dto);
              finish();
            }
          });
        } else {
          // Update children only.
          finish();
        }
      } else
        callback(null, self);
    }

    function data_remove (callback) {
      // Helper callback for post-removal actions.
      function cb (err) {
        if (err) {
          callback(err);
        } else {
          markAsRemoved();
          callback(null, null);
        }
      }
      // Check permissions.
      if (canDo(Action.removeObject)) {
        // Remove children first.
        removeChildren(function (err) {
          if (err)
            callback(err);

          if (extensions.dataRemove) {
            // Custom removal.
            extensions.dataRemove.call(self, getDataContext(), cb);
          } else {
            // Standard removal.
            var filter = properties.getKey(getPropertyValue);
            dao.checkMethod('remove');
            dao.remove(filter, cb);
          }
        });
      } else
        callback(null);
    }

    //endregion

    //region Actions

    this.create = function(callback) {
      data_create(callback);
    };

    this.fetch = function(filter, method, callback) {
      data_fetch(filter, method || 'fetch', callback);
    };

    this.save = function(callback) {
      if (this.isValid()) {
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
              throw new ModelError('readOnly', properties.name , property.name);
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

  EditableRootModel.prototype.name = properties.name;

  //region Factory methods

  EditableRootModel.create = function(callback) {
    var instance = new EditableRootModel();
    instance.create(function (err) {
      if (err)
        callback(err);
      else
        callback(null, instance);
    });
  };

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

module.exports = EditableRootModelCreator;
