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
var ExtensionManagerSync = require('./shared/extension-manager-sync.js');
var DataStore = require('./shared/data-store.js');
var DataContext = require('./shared/data-context.js');
var TransferContext = require('./shared/transfer-context.js');
var UserInfo = require('./shared/user-info.js');
var RuleManager = require('./rules/rule-manager.js');
var BrokenRuleList = require('./rules/broken-rule-list.js');
var RuleSeverity = require('./rules/rule-severity.js');
var Action = require('./rules/authorization-action.js');
var AuthorizationContext = require('./rules/authorization-context.js');

var ReadOnlyModelSyncCreator = function(properties, rules, extensions) {

  if (!(properties instanceof PropertyManager))
    throw new Error('Argument properties of ReadOnlyModelSyncCreator must be a PropertyManager object.');

  if (!(rules instanceof RuleManager))
    throw new Error('Argument rules of ReadOnlyModelSyncCreator must be a RuleManager object.');

  if (!(extensions instanceof ExtensionManagerSync))
    throw new Error('Argument extensions of ReadOnlyModelSyncCreator must be an ExtensionManagerSync object.');

  var ReadOnlyModelSync = function() {

    var self = this;
    var store = new DataStore();
    var brokenRules = new BrokenRuleList(properties.name);
    var dao = null;
    var user = null;
    var dataContext = null;
    var xferContext = null;

    // Determine if root or child element.
    var parent = ensureArgument.isOptionalType(arguments[0], [ ModelBase, CollectionBase ],
      'Argument parent of ReadOnlyModelSync constructor must be a read-only model or collection object.');

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

    function getTransferContext () {
      if (!xferContext)
        xferContext = new TransferContext(properties.toArray(), getPropertyValue, setPropertyValue);
      return xferContext;
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

    function fetchChildren(dto) {
      properties.children().forEach(function(property) {
        var child = getPropertyValue(property);
        child.fetch(dto[property.name]);
      });
    }

    //endregion

    //region Data portal methods

    function getDataContext() {
      if (!dataContext)
        dataContext = new DataContext(
          dao, user, false, properties.toArray(), getPropertyValue, setPropertyValue
        );
      return dataContext;
    }

    function data_fetch (filter, method) {
      // Check permissions.
      if (method === 'fetch' ? canDo(Action.fetchObject) : canExecute(method)) {
        var dto = null;
        if (extensions.dataFetch) {
          // Custom fetch.
          dto = extensions.dataFetch.call(self, getDataContext(), filter, method);
        } else {
          // Standard fetch.
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
      }
    }

    //endregion

    //region Actions

    this.fetch = function(filter, method) {
      data_fetch(filter, method || 'fetch');
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
      //if (store.setValue(property, value))
      //  markAsChanged(true);
      store.setValue(property, value);
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
          store.initValue(property, property.type.create(self));
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
  util.inherits(ReadOnlyModelSync, ModelBase);

  ReadOnlyModelSync.prototype.name = properties.name;

  //region Factory methods

  ReadOnlyModelSync.fetch = function(filter, method) {
    var instance = new ReadOnlyModelSync();
    instance.fetch(filter, method);
    return instance;
  };

  ReadOnlyModelSync.load = function(parent, data) {
    var instance = new ReadOnlyModelSync(parent);
    instance.fetch(data);
    return instance;
  };

  //endregion

  return ReadOnlyModelSync;
};

module.exports = ReadOnlyModelSyncCreator;
