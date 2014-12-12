'use strict';

var util = require('util');
var ModelBase = require('./model-base.js');
var config = require('./shared/config-reader.js');

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

  var EditableModel = function() {

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

    function fetchChildren(dto, callback) {
      var count = 0;
      var error = null;

      children.forEach(function(property) {
        var child = getProperty(property);
        var fetchLoad = child['load'] ?
          child.load :               // Child collection.
          child.fetch;               // Child element.
        fetchLoad(dto[property.name], function (err) {
          error = error || err;
          count++;
          // Check if all children is done.
          if (count === children.length) {
            callback(error);
          }
        });
      });
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

      children.forEach(function(property) {
        var child = getProperty(property);
        child.save(function (err, result) {
          error = error || err;
          count++;
          // Check if all children is done.
          if (count === children.length) {
            callback(error);
          }
        });
      });
    }

    //endregion

    //region Data portal methods

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

    function data_fetch (key, method, callback) {
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
      if (canDo(AuthorizationAction.fetchObject)) {
        if (extensions.dataFetch) {
          // Custom fetch.
          extensions.dataFetch.call(self, getDataContext(), key, method,function (err, dto) {
            if (err)
              callback(err);
            else
              finish(dto);
          });
        } else {
          // Standard fetch.
          if (parent) {
            // Child element gets data from parent.
            fromDto.call(self, key);
            finish(dto);
          } else {
            // Root element fetches data from repository.
            dao[method](key, function (err, dto) {
              if (err) {
                callback(err);
              } else {
                fromDto.call(self, dto);
                finish(dto);
              }
            });
          }
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
      if (canDo(AuthorizationAction.createObject)) {
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
      if (canDo(AuthorizationAction.updateObject)) {
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
          callback(null);
        }
      }
      // Check permissions.
      if (canDo(AuthorizationAction.removeObject)) {
        // Remove children first.
        removeChildren(function (err) {
          if (err)
            callback(err);

          if (extensions.dataRemove) {
            // Custom removal.
            extensions.dataRemove.call(self, getDataContext(), cb);
          } else {
            // Standard removal.
            var key = toDto.call(self, true);
            dao.remove(key, cb);
          }
        });
      } else
        callback(null);
    }

    function getDataContext() {
      return new DataContext(dao, user, isDirty, toDto, fromDto);
    }

    //endregion

    //region Actions

    this.create = function(callback) {
      data_create(callback);
    };

    this.fetch = function(key, method, callback) {
      data_fetch(key, method || 'fetch', callback);
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

    // Determine if root or child element.
    parent = arguments.length > 0 ? arguments[0] : null;

    //endregion

    // Immutable object.
    Object.freeze(this);
  };
  util.inherits(EditableModel, ModelBase);

  //region Factory methods

  EditableModel.create = function(parent, callback) {
    var instance = new EditableModel(parent);
    instance.create(function (err) {
      if (err)
        callback(err);
      else
        callback(null, instance);
    });
  };

  EditableModel.fetch = function(key, method) {
    var instance = new EditableModel();
    instance.fetch(key, method, function (err) {
      if (err)
        callback(err);
      else
        callback(null, instance);
    });
  };

  EditableModel.remove = function(key, method) {
    var instance = new EditableModel();
    instance.fetch(key, method, function (err) {
      if (err) {
        callback(err);
      }
      else {
        instance.remove();
        instance.save();
        callback(null);
      }
    });
  };

  //endregion

  return EditableModel;
};
