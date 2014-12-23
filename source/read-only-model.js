'use strict';

var util = require('util');
var ModelBase = require('./model-base.js');
var config = require('./shared/config-reader.js');
var ensureArgument = require('./shared/ensure-argument.js');

var DataType = require('./data-types/data-type.js');
var Enumeration = require('./shared/enumeration.js');
var PropertyInfo = require('./shared/property-info.js');
var PropertyManager = require('./shared/property-manager.js');
var ExtensionManager = require('./shared/extension-manager.js');
var DataStore = require('./shared/data-store.js');
var DataContext = require('./shared/data-context.js');
var TransferContext = require('./shared/transfer-context.js');
var UserInfo = require('./shared/user-info.js');
var RuleManager = require('./rules/rule-manager.js');
var BrokenRuleList = require('./rules/broken-rule-list.js');
var RuleSeverity = require('./rules/rule-severity.js');
var AuthorizationAction = require('./rules/authorization-action.js');
var AuthorizationContext = require('./rules/authorization-context.js');

var EditableModelCreator = function(properties, rules, extensions) {

  if (!(properties instanceof PropertyManager))
    throw new Error('Argument properties of EditableModelCreator must be a PropertyManager object.');

  if (!(rules instanceof RuleManager))
    throw new Error('Argument rules of EditableModelCreator must be a RuleManager object.');

  if (!(extensions instanceof ExtensionManager))
    throw new Error('Argument extensions of EditableModelCreator must be an ExtensionManager object.');

  var EditableModel = function() {

    var self = this;
    var store = new DataStore();
    var brokenRules = new BrokenRuleList(properties.name);
    var dao = null;
    var user = null;

    // Determine if root or child element.
    var parent = ensureArgument.isOptionalType(arguments[0], ModelBase,
      'Argument parent of EditableModel constructor must be an EditableModel object.');

    // Set up business rules.
    rules.initialize(config.noAccessBehavior);

    // Get data access object.
    if (extensions.daoBuilder)
      dao = extensions.daoBuilder(extensions.dataSource, extensions.modelPath);
    else
      dao = config.daoBuilder(extensions.dataSource, extensions.modelPath);

    // Get principal.
    if (config.userReader) {
      user = ensureArgument.isOptionalType(config.userReader(), UserInfo,
        'The userReader method of business objects configuration must return a UserInfo instance.');
    }

    //region Transfer objects methods

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

      properties.children().forEach(function(property) {
        var child = getPropertyValue(property);
        cto[property.name] = child.toCto();
      });
      return cto;
    };

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

    //endregion

    //region Data portal methods

    function data_fetch (filter, method, callback) {
      // Helper function for post-fetch actions.
      function finish (dto) {
        // Fetch children as well.
        fetchChildren(dto, function (err) {
          if (err)
            callback(err);
          else
            callback(null, self);
        });
      }
      // Check permissions.
      if (method === 'fetch' ? canDo(AuthorizationAction.fetchObject) : canExecute(method)) {
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
          if (parent) {
            // Child element gets data from parent.
            fromDto.call(self, filter);
            finish(filter);
          } else {
            // Root element fetches data from repository.
            dao[method](filter, function (err, dto) {
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

    function getDataContext() {
      return new DataContext(dao, user, false, null, fromDto);
    }

    //endregion

    //region Actions

    this.fetch = function(filter, method, callback) {
      data_fetch(filter, method || 'fetch', callback);
    };

    //endregion

    //region Validation

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
      return store.getValue(property);
    }

    function setPropertyValue(property, value) {
      store.setValue(property, value);
      //if (store.setValue(property, value))
      //  markAsChanged(true);
    }

    function readPropertyValue(property) {
      if (canBeRead(property))
        return store.getValue(property);
      else
        return null;
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
            throw new Error(properties.name + '.' + property.name + ' property is read-only.');
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
            throw new Error('Property ' + properties.name + '.' + property.name + ' is read-only.');
          },
          enumerable: false
        });
      }
    });

    //endregion

    // Immutable object.
    Object.freeze(this);
  };
  util.inherits(EditableModel, ModelBase);

  EditableModel.prototype.name = properties.name;

  //region Factory methods

  EditableModel.fetch = function(filter, method, callback) {
    if (!callback) {
      callback = method;
      method = undefined;
    }
    var instance = new EditableModel();
    instance.fetch(filter, method, function (err) {
      if (err)
        callback(err);
      else
        callback(null, instance);
    });
  };

  EditableModel.load = function(parent, data, callback) {
    var instance = new EditableModel(parent);
    instance.fetch(data, undefined, function (err) {
      if (err)
        callback(err);
      else
        callback(null, instance);
    });
  };

  //endregion

  return EditableModel;
};

module.exports = EditableModelCreator;
