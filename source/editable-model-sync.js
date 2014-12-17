'use strict';

var util = require('util');
var ModelBase = require('./model-base.js');
var config = require('./shared/config-reader.js');

var DataType = require('./data-types/data-type.js');
var Enumeration = require('./shared/enumeration.js');
var PropertyInfo = require('./shared/property-info.js');
var PropertyManager = require('./shared/property-manager.js');
var ExtensionManagerSync = require('./shared/extension-manager-sync.js');
var UserInfo = require('./shared/user-info.js');
var DataContext = require('./shared/data-context.js');
var TransferContext = require('./shared/transfer-context.js');
var RuleManager = require('./rules/rule-manager.js');
var BrokenRuleList = require('./rules/broken-rule-list.js');
var RuleSeverity = require('./rules/rule-severity.js');
var AuthorizationAction = require('./rules/authorization-action.js');
var AuthorizationContext = require('./rules/authorization-context.js');
var ValidationContext = require('./rules/validation-context.js');

var MODEL_STATE = require('./model-state.js');

module.exports = function(properties, rules, extensions) {

  if (!(properties instanceof PropertyManager))
    throw new Error('Argument properties of EditableModelSync constructor must be a PropertyManager object.');

  if (!(rules instanceof RuleManager))
    throw new Error('Argument rules of EditableModelSync constructor must be a RuleManager object.');

  if (!(extensions instanceof ExtensionManagerSync))
    throw new Error('Argument extensions of EditableModelSync constructor must be an ExtensionManagerSync object.');

  var EditableModelSync = function() {

    var self = this;
    var parent = null;
    var state = null;
    var isDirty = false;
    var brokenRules = new BrokenRuleList(properties.name);
    var isValidated = false;
    var children = [];
    var dao = null;
    var user = null;

    //region Transfer objects methods

    function msgNoProperty(name) {
      return properties.name + ' model has no property named ' + name + '.';
    }

    function baseToDto() {
      var dto = {};
      properties.forEach(function (property) {
        if (property.type instanceof DataType && property.isOnDto) {
          dto[property.name] = getPropertyValue(property);
        }
      });
      return dto;
    }

    function toDto () {
      if (extensions.toDto)
        return extensions.toDto(
            new TransferContext(properties.toArray(), getPropertyValue, setPropertyValue)
          );
      else
        return baseToDto();
    }

    function baseFromDto(dto) {
      properties.forEach(function (property) {
        if (property.type instanceof DataType && property.isOnDto) {
          if (dto.hasOwnProperty(property.name) && typeof dto[property.name] !== 'function') {
            setPropertyValue(property, dto[property.name]);
          }
        }
      });
    }

    function fromDto (dto) {
      if (extensions.fromDto)
        extensions.fromDto(
            new TransferContext(properties.toArray(), getPropertyValue, setPropertyValue),
            dto
          );
      else
        baseFromDto(dto);
    }

    function baseToCto() {
      var cto = {};
      properties.forEach(function (property) {
        if (property.type instanceof DataType && property.isOnCto) {
          cto[property.name] = readPropertyValue(property);
        }
      });
      return cto;
    }

    this.toCto = function () {
      var cto = {};
      if (extensions.toCto)
        cto = extensions.toCto(
          new TransferContext(properties.toArray(), readPropertyValue, writePropertyValue)
        );
      else
        cto = baseToCto();

      children.forEach(function(property) {
        var child = getPropertyValue(property);
        cto[property.name] = child.toCto();
      });
      return cto;
    };

    function baseFromCto(cto) {
      if (cto && typeof cto === 'object') {
        properties.forEach(function (property) {
          if (property.type instanceof DataType && property.isOnCto) {
            if (cto.hasOwnProperty(property.name) && typeof cto[property.name] !== 'function') {
              writePropertyValue(property, cto[property.name]);
            }
          }
        });
      }
    }

    this.fromCto = function (cto) {
      if (extensions.fromCto)
        extensions.fromCto(
          new TransferContext(properties.toArray(), readPropertyValue, writePropertyValue),
          cto
        );
      else
        baseFromCto(cto);

      children.forEach(function(property) {
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
        propagateChange(); // up to the parent
      }
      else if (state !== MODEL_STATE.created)
        illegal(MODEL_STATE.created);
    }

    function markAsChanged(itself) {
      if (state === MODEL_STATE.pristine) {
        state = MODEL_STATE.changed;
        isDirty |= itself;
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
      throw new Error('Illegal state transition: ' +
      (state == null ? 'NULL' : MODEL_STATE.getName(state)) + ' => ' +
      MODEL_STATE.getName(newState));
    }

    function propagateChange() {
      if (parent)
        parent.childHasChanged();
    }

    this.childHasChanged = function() {
      markAsChanged(false);
    };

    function propagateRemoval() {
      children.forEach(function(property) {
        var child = getPropertyValue(property);
        child.remove();
      });
    }

    //endregion

    //region Show object state

    this.getModelState = function () {
      return MODEL_STATE.getName(state);
    };

    //Object.defineProperty(this, 'isPristine', {
    //  get: function () {
    //    return state === MODEL_STATE.pristine;
    //  }
    //});
    //
    //Object.defineProperty(this, 'isCreated', {
    //  get: function () {
    //    return state === MODEL_STATE.created;
    //  }
    //});
    //
    //Object.defineProperty(this, 'isChanged', {
    //  get: function () {
    //    return state === MODEL_STATE.changed;
    //  }
    //});
    //
    //Object.defineProperty(this, 'isForRemoval', {
    //  get: function () {
    //    return state === MODEL_STATE.markedForRemoval;
    //  }
    //});
    //
    //Object.defineProperty(this, 'isRemoved', {
    //  get: function () {
    //    return state === MODEL_STATE.removed;
    //  }
    //});

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
          auth = canDo(AuthorizationAction.removeObject);
        else if (self.isNew())
          auth = canDo(AuthorizationAction.createObject);
        else
          auth = canDo(AuthorizationAction.updateObject);
        return auth && self.isDirty() && self.isValid();
      }
    });

    //endregion

    //region Child methods

    function fetchChildren(dto) {
      children.forEach(function(property) {
        var child = getPropertyValue(property);
        if (child['load']) {
          // Child collection.
          child.load(dto[property.name]);
        } else {
          // Child element.
          child.fetch(dto[property.name]);
        }
      });
    }

    function insertChildren() {
      children.forEach(function(property) {
        var child = getPropertyValue(property);
        child.save();
      });
    }

    function updateChildren() {
      children.forEach(function(property) {
        var child = getPropertyValue(property);
        child.save();
      });
    }

    function removeChildren() {
      children.forEach(function(property) {
        var child = getPropertyValue(property);
        child.save();
      });
    }

    //endregion

    //region Data portal methods

    function data_create () {
      if (extensions.dataCreate) {
        // Custom create.
        extensions.dataCreate.call(self, getDataContext());
      } else {
        // Standard create.
        var dto = dao.create();
        fromDto.call(self, dto);
      }
      markAsCreated();
    }

    function data_fetch (filter, method) {
      // Check permissions.
      if (method === 'fetch' ? canDo(AuthorizationAction.fetchObject) : canExecute(method)) {
        if (extensions.dataFetch) {
          // Custom fetch.
          extensions.dataFetch.call(self, getDataContext(), filter, method);
        } else {
          // Standard fetch.
          var dto = null;
          if (parent) {
            // Child element gets data from parent.
            dto = filter;
          } else {
            // Root element fetches data from repository.
            dto = dao[method](filter);
          }
          fromDto.call(self, dto);
        }
        // Fetch children as well.
        fetchChildren(dto);
        markAsPristine();
      }
    }

    function data_insert () {
      // Check permissions.
      if (canDo(AuthorizationAction.createObject)) {
        if (extensions.dataInsert) {
          // Custom insert.
          extensions.dataInsert.call(self, getDataContext());
        } else {
          // Standard insert.
          if (parent) {
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
          }
          var dto = toDto.call(self);
          dto = dao.insert(dto);
          fromDto.call(self, dto);
        }
        // Insert children as well.
        insertChildren();
        markAsPristine();
      }
    }

    function data_update () {
      // Check permissions.
      if (canDo(AuthorizationAction.updateObject)) {
        if (extensions.dataUpdate) {
          // Custom update.
          extensions.dataUpdate.call(self, getDataContext());
        } else if (isDirty) {
          // Standard update.
          var dto = toDto.call(self);
          dto = dao.update(dto);
          fromDto.call(self, dto);
        }
        // Update children as well.
        updateChildren();
        markAsPristine();
      }
    }

    function data_remove () {
      // Check permissions.
      if (canDo(AuthorizationAction.removeObject)) {
        // Remove children first.
        removeChildren();
        if (extensions.dataRemove) {
          // Custom removal.
          extensions.dataRemove.call(self, getDataContext());
        } else {
          // Standard removal.
          var filter = toDto.call(self, true);
          dao.remove(filter);
        }
        markAsRemoved();
      }
    }

    function getDataContext() {
      return new DataContext(dao, user, isDirty, toDto, fromDto);
    }

    //endregion

    //region Actions

    this.create = function() {
      data_create();
    };

    this.fetch = function(key, method) {
      data_fetch(key, method || 'fetch');
    };

    this.save = function() {
      if (this.isValid()) {
        switch (state) {
          case MODEL_STATE.created:
            data_insert();
            return this;
          case MODEL_STATE.changed:
            data_update();
            return this;
          case MODEL_STATE.markedForRemoval:
            data_remove();
            return;
          default:
            return this;
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

    //region Permissions

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

    function getAuthorizationContext(action, targetName) {
      return new AuthorizationContext(action, targetName || '', user, brokenRules);
    }

    //endregion

    //region Properties

    function getPropertyValue(property) {
      return properties.getValue(property);
    }

    function setPropertyValue(property, value) {
      if (properties.setValue(property, value))
        markAsChanged(true);
    }

    function readPropertyValue(property) {
      if (canBeRead(property))
        return properties.getValue(property);
      else
        return null;
    }

    function writePropertyValue(property, value) {
      if (canBeWritten(property)) {
        if (properties.setValue(property, value))
          markAsChanged(true);
      }
    }

    properties.map(function(property) {

      if (property.type instanceof DataType) {
        // Normal property
        properties.initValue(property);

        Object.defineProperty(self, property.name, {
          get: function () {
            return readPropertyValue(property);
          },
          set: function (value) {
            if (property.isReadOnly)
              throw new Error(properties.name + '.' + property.name + ' property is read-only.');
            writePropertyValue(property, value);
          },
          enumerable: true
        });

      } else {
        // Child item/collection
        if (property.type.create)
          // Item
          properties.initValue(property, property.type.create(self));
        else
          // Collection
          properties.initValue(property, new property.type(self));

        Object.defineProperty(self, property.name, {
          get: function () {
            return readPropertyValue(property);
          },
          set: function (value) {
            throw new Error('Property ' + properties.name + '.' + property.name + ' is read-only.');
          },
          enumerable: false
        });

        children.push(property);
      }
    });

    //endregion

    //region Initialization

    rules.initialize(config.noAccessBehavior);

    if (extensions.daoBuilder)
      dao = new extensions.daoBuilder(extensions.dataSource, extensions.modelPath);
    else
      dao = new config.daoBuilder(extensions.dataSource, extensions.modelPath);

    if (config.userReader) {
      user = config.userReader();
      if (user && !(user instanceof UserInfo))
        throw new Error('The userReader method of BusinessObjects configuration must return a UserInfo instance.');
    }

    // Determine if root or child element.
    parent = arguments.length > 0 ? arguments[0] : null;

    //endregion

    // Immutable object.
    Object.freeze(this);
  };
  util.inherits(EditableModelSync, ModelBase);

  //region Factory methods

  EditableModelSync.create = function(parent) {
    var instance = new EditableModelSync(parent);
    instance.create();
    return instance;
  };

  EditableModelSync.fetch = function(filter, method) {
    var instance = new EditableModelSync();
    instance.fetch(filter, method);
    return instance;
  };

  //endregion

  EditableModelSync.prototype.name = properties.name;
  return EditableModelSync;
};
