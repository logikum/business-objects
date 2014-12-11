var config = require('bo/shared/config-reader.js');

var DataType = require('./data-types/data-type.js');
var Enumeration = require('./shared/enumeration.js');
var PropertyInfo = require('./shared/property-info.js');
var PropertyManager = require('./shared/property-manager.js');
var ExtensionManager = require('./shared/extension-manager.js');
var UserInfo = require('./shared/user-info.js');
var DataContext = require('./shared/data-context.js');
var RuleManager = require('./rules/rule-manager.js');
var BrokenRuleList = require('./rules/broken-rule-list.js');
var RuleSeverity = require('./rules/rule-severity.js');
var AuthorizationAction = require('./rules/authorization-action.js');
var AuthorizationContext = require('./rules/authorization-context.js');
var ValidationContext = require('./rules/validation-context.js');

var MODEL_STATE = require('./model-state.js');

module.exports = function(properties, rules, extensions) {

  if (!(properties instanceof PropertyManager))
    throw new Error('Argument properties of EditableModel constructor must be a PropertyManager object.');

  if (!(rules instanceof RuleManager))
    throw new Error('Argument rules of EditableModel constructor must be a RuleManager object.');

  if (!(extensions instanceof ExtensionManager))
    throw new Error('Argument extensions of EditableModel constructor must be an ExtensionManager object.');

  var Model = function() {

    var self = this;
    var parent = null;
    var state = null;
    var isDirty = false;
    var brokenRules = new BrokenRuleList(properties.name);
    var isValidated = false;
    var children = [];
    var dao = null;
    var user = null;

    //region Extension methods for transfer objects

    function msgNoProperty(name) {
      return properties.name + ' model has no property named ' + name + '.';
    }

    function baseToDto() {
      var dto = {};
      properties.forEach(function (property) {
        if (property instanceof PropertyInfo && property.type instanceof DataType) {
          dto[property.name] = getProperty(property);
        }
      });
      return dto;
    }

    function baseFromDto(dto) {
      for (var name in dto) {
        if (dto.hasOwnProperty(name) && typeof dto[name] !== 'function') {
          var property = properties.getByName(name, msgNoProperty(name));
          if (property.type instanceof DataType) {
            setProperty(property, dto[name]);
          }
        }
      }
    }

    var toDto = extensions.toDto ? extensions.toDto : baseToDto;
    var fromDto = extensions.fromDto ? extensions.fromDto : baseFromDto;

    function baseToCto() {
      var cto = {};
      properties.forEach(function (property) {
        if (property instanceof PropertyInfo && property.type instanceof DataType) {
          cto[property.name] = readProperty(property);
        }
      });
      return cto;
    }

    function baseFromCto(cto) {
      if (cto && typeof cto === 'object') {
        for (var name in cto) {
          if (cto.hasOwnProperty(name) && typeof cto[name] !== 'function') {
            var property = properties.getByName(name, msgNoProperty(name));
            if (property.type instanceof DataType) {
              writeProperty(property, cto[name]);
            }
          }
        }
      }
    }

    this.toCto = function () {
      var fn = extensions.toCto ? extensions.toCto : baseToCto;
      var cto = fn();

      children.forEach(function(property) {
        var child = getProperty(property);
        cto[property.name] = child.toCto();
      });
    };

    this.fromCto = function (cto) {
      var fn = extensions.fromCto ? extensions.fromCto : baseFromCto;
      fn(cto);

      children.forEach(function(property) {
        var child = getProperty(property);
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
        var child = getProperty(property);
        child.remove();
      });
    }

    //endregion

    //region Show object state

    Object.defineProperty(this, 'state', {
      get: function () {
        return MODEL_STATE.getName(state);
      }
    });

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
        var child = getProperty(property);
        if (child['load']) {
          // Child collection.
          child.load(dto[property.name]);
        } else {
          // Child element.
          child.data_fetch(dto[property.name]);
        }
      });
    }

    function insertChildren() {
      children.forEach(function(property) {
        var child = getProperty(property);
        child.save();
      });
    }

    function updateChildren() {
      children.forEach(function(property) {
        var child = getProperty(property);
        child.save();
      });
    }

    function removeChildren() {
      children.forEach(function(property) {
        var child = getProperty(property);
        child.save();
      });
    }

    //endregion

    //region Data portal methods

    function data_create () {
      if (extensions.dataCreate) {
        extensions.dataCreate.call(self, getDataContext());
      } else {
        var dto = dao.create();
        fromDto.call(self, dto);
      }
      markAsCreated();
    }

    // function data_fetch (key/dto)
    function data_fetch () {
      if (canDo(AuthorizationAction.fetchObject)) {
        if (extensions.dataFetch) {
          extensions.dataFetch.call(self, getDataContext(), arguments[0]);
        } else {
          var dto = null;
          if (parent) {
            // Child element gets data from parent.
            dto = arguments[0];
          } else {
            // Root element fetches data from repository.
            var key = arguments[0];
            dto = dao.fetch(key);
          }
          fromDto.call(self, dto);
        }
        fetchChildren(dto);
        markAsPristine();
      }
    }

    function data_insert () {
      if (canDo(AuthorizationAction.createObject)) {
        if (extensions.dataInsert) {
          extensions.dataInsert.call(self, getDataContext());
        } else {
          var dto = toDto.call(self);
          dto = dao.insert(dto);
          fromDto.call(self, dto);
        }
        insertChildren();
        markAsPristine();
      }
    }

    function data_update () {
      if (canDo(AuthorizationAction.updateObject)) {
        if (extensions.dataUpdate) {
          extensions.dataUpdate.call(self, getDataContext());
        } else if (isDirty) {
          var dto = toDto.call(self);
          dto = dao.update(dto);
          fromDto.call(self, dto);
        }
        updateChildren();
        markAsPristine();
      }
    }

    function data_remove () {
      if (canDo(AuthorizationAction.removeObject)) {
        removeChildren();
        if (extensions.dataRemove) {
          extensions.dataRemove.call(self, getDataContext());
        } else {
          var key = toDto.call(self, true);
          dao.remove(key);
        }
        markAsRemoved();
      }
    }

    function getDataContext() {
      return new DataContext(dao, user, isDirty, toDto, fromDto);
    }

    //endregion

    //region Actions

    this.remove = function() {
      markForRemoval();
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
      rules.validate(property, new ValidationContext(getProperty, brokenRules));
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

    function getProperty(property) {
      return properties.getValue(property);
    }

    function setProperty(property, value) {
      if (properties.setValue(property, value))
        markAsChanged(true);
    }

    function readProperty(property) {
      if (canBeRead(property))
        return properties.getValue(property);
      else
        return null;
    }

    function writeProperty(property, value) {
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
            return readProperty(property);
          },
          set: function (value) {
            if (property.readOnly)
              throw new Error(properties.name + '.' + property.name + ' property is read-only.');
            writeProperty(property, value);
          },
          enumerable: true
        });

      } else {
        // Child item/collection
        properties.initValue(property, new property.type(self));

        Object.defineProperty(self, property.name, {
          get: function () {
            return readProperty(property);
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

    switch (arguments.length) {
      case 0:
        // Create root element.
        data_create();
        break;
      case 1:
        // Fetch root element.
        var key = arguments[0];
        data_fetch(key);
        break;
      default:
        parent = arguments[0];
        var dto = arguments[1];
        if (dto)
        // Fetch child element.
          data_fetch(dto);
        else
        // Create child element.
          data_create();
        break;
    }

    //endregion

    // Immutable object.
    Object.freeze(this);
  };

  // Factory remove.
  Model.remove = function(key) {
    if (parent)
      throw new Error('Use remove method of instance to delete a child element.');

    var instance = new Model(key);
    instance.remove();
    instance.save();
  };

  return Model;
};
