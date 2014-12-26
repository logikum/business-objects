'use strict';

var util = require('util');
var ModelBase = require('./model-base.js');
var CollectionBase = require('./collection-base.js');
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
var Action = require('./rules/authorization-action.js');
var AuthorizationContext = require('./rules/authorization-context.js');

var ReadOnlyModelCreator = function(properties, rules, extensions) {

  if (!(properties instanceof PropertyManager))
    throw new Error('Argument properties of ReadOnlyModelCreator must be a PropertyManager object.');

  if (!(rules instanceof RuleManager))
    throw new Error('Argument rules of ReadOnlyModelCreator must be a RuleManager object.');

  if (!(extensions instanceof ExtensionManager))
    throw new Error('Argument extensions of ReadOnlyModelCreator must be an ExtensionManager object.');

  var ReadOnlyModel = function() {

    var self = this;
    var store = new DataStore();
    var brokenRules = new BrokenRuleList(properties.name);
    var dao = null;
    var user = null;

    // Determine if root or child element.
    var parent = ensureArgument.isOptionalType(arguments[0], [ ModelBase, CollectionBase ],
      'Argument parent of ReadOnlyModel constructor must be a read-only model or collection object.');

    // Set up business rules.
    rules.initialize(config.noAccessBehavior);

    // Get data access object.
    if (!parent || parent instanceof ModelBase) {
      if (extensions.daoBuilder)
        dao = extensions.daoBuilder(extensions.dataSource, extensions.modelPath);
      else
        dao = config.daoBuilder(extensions.dataSource, extensions.modelPath);
    }

    // Get principal.
    if (config.userReader) {
      user = ensureArgument.isOptionalType(config.userReader(), UserInfo,
        'The userReader method of business objects configuration must return a UserInfo instance.');
    }

    //region Transfer object methods

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
        extensions.fromDto.call(
          self,
          new TransferContext(properties.toArray(), getPropertyValue, setPropertyValue),
          dto
        );
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
        cto = extensions.toCto.call(
          self,
          new TransferContext(properties.toArray(), readPropertyValue, null /*writePropertyValue*/)
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

    //region Permissions

    function getAuthorizationContext(action, targetName) {
      return new AuthorizationContext(action, targetName || '', user, brokenRules);
    }

    function canBeRead (property) {
      return rules.hasPermission(
        getAuthorizationContext(Action.readProperty, property.name)
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

    //endregion

    //region Data portal methods

    function getDataContext() {
      return new DataContext(dao, user, false, properties.toArray(), getPropertyValue, setPropertyValue);
    }

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
  util.inherits(ReadOnlyModel, ModelBase);

  ReadOnlyModel.prototype.name = properties.name;

  //region Factory methods

  ReadOnlyModel.fetch = function(filter, method, callback) {
    if (!callback) {
      callback = method;
      method = undefined;
    }
    var instance = new ReadOnlyModel();
    instance.fetch(filter, method, function (err) {
      if (err)
        callback(err);
      else
        callback(null, instance);
    });
  };

  ReadOnlyModel.load = function(parent, data, callback) {
    var instance = new ReadOnlyModel(parent);
    instance.fetch(data, undefined, function (err) {
      if (err)
        callback(err);
      else
        callback(null, instance);
    });
  };

  //endregion

  return ReadOnlyModel;
};

module.exports = ReadOnlyModelCreator;
