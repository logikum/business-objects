'use strict';

//region Imports

var util = require('util');
var config = require('./shared/configuration-reader.js');
var EnsureArgument = require('./shared/ensure-argument.js');

var CollectionBase = require('./collection-base.js');
var ModelError = require('./shared/model-error.js');
var ExtensionManagerSync = require('./shared/extension-manager-sync.js');

var RuleManager = require('./rules/rule-manager.js');
var BrokenRuleList = require('./rules/broken-rule-list.js');
var Action = require('./rules/authorization-action.js');
var AuthorizationContext = require('./rules/authorization-context.js');

var DataPortalAction = require('./shared/data-portal-action.js');
var DataPortalContext = require('./shared/data-portal-context.js');
var DataPortalEvent = require('./shared/data-portal-event.js');
var DataPortalEventArgs = require('./shared/data-portal-event-args.js');
var DataPortalError = require('./shared/data-portal-error.js');

var MODEL_DESC = 'Read-only root collection';
var M_FETCH = DataPortalAction.getName(DataPortalAction.fetch);

//endregion

/**
 * Factory method to create definitions of synchronous read-only root collections.
 *
 * @function bo.ReadOnlyRootCollectionSync
 * @param {string} name - The name of the collection.
 * @param {ReadOnlyChildModelSync} itemType - The model type of the collection items.
 * @param {bo.shared.RuleManager} rules - The validation and authorization rules.
 * @param {bo.shared.ExtensionManagerSync} extensions - The customization of the collection.
 * @returns {ReadOnlyRootCollectionSync} The constructor of a synchronous read-only root collection.
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The collection name must be a non-empty string.
 * @throws {@link bo.system.ArgumentError Argument error}: The rules must be a RuleManager object.
 * @throws {@link bo.system.ArgumentError Argument error}: The extensions must be a ExtensionManagerSync object.
 * @throws {@link bo.shared.ModelError Model error}: The item type must be an ReadOnlyChildModelSync.
 */
var ReadOnlyRootCollectionSyncFactory = function(name, itemType, rules, extensions) {

  name = EnsureArgument.isMandatoryString(name,
      'c_manString', 'ReadOnlyRootCollectionSync', 'name');
  rules = EnsureArgument.isMandatoryType(rules, RuleManager,
      'c_manType', 'ReadOnlyRootCollectionSync', 'rules');
  extensions = EnsureArgument.isMandatoryType(extensions, ExtensionManagerSync,
      'c_manType', 'ReadOnlyRootCollectionSync', 'extensions');

  // Verify the model type of the item type.
  if (itemType.modelType !== 'ReadOnlyChildModelSync')
    throw new ModelError('invalidItem', itemType.prototype.name, itemType.modelType,
        'ReadOnlyRootCollectionSync', 'ReadOnlyChildModelSync');

  /**
   * @classdesc Represents the definition of a synchronous read-only root collection.
   * @description Creates a new synchronous read-only root collection instance.
   *
   * @name ReadOnlyRootCollectionSync
   * @constructor
   *
   * @extends ModelBase
   */
  var ReadOnlyRootCollectionSync = function () {
    CollectionBase.call(this);

    var self = this;
    var items = [];
    var brokenRules = new BrokenRuleList(name);
    var dao = null;
    var dataContext = null;
    var connection = null;

    this.name = name;

    // Get data access object.
    if (extensions.daoBuilder)
      dao = extensions.daoBuilder(extensions.dataSource, extensions.modelPath);
    else
      dao = config.daoBuilder(extensions.dataSource, extensions.modelPath);

    Object.defineProperty(self, 'count', {
      get: function () {
        return items.length;
      },
      enumerable: false
    });

    //region Transfer object methods

    this.toCto = function () {
      var cto = [];
      items.forEach(function (item) {
        cto.push(item.toCto());
      });
      return cto;
    };

    //endregion

    //region Permissions

    function getAuthorizationContext(action, targetName) {
      return new AuthorizationContext(action, targetName || '', brokenRules);
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

    //region Data portal methods

    function getDataContext (connection) {
      if (!dataContext)
        dataContext = new DataPortalContext(dao);
      return dataContext.setState(connection, false);
    }

    function getEventArgs (action, methodName, error) {
      return new DataPortalEventArgs(name, action, methodName, error);
    }

    function wrapError (action, error) {
      return new DataPortalError(MODEL_DESC, name, action, error);
    }

    function data_fetch (filter, method) {
      // Check permissions.
      if (method === M_FETCH ? canDo(Action.fetchObject) : canExecute(method)) {
        try {
          // Open connection.
          connection = config.connectionManager.openConnection(extensions.dataSource);
          // Launch start event.
          self.emit(
              DataPortalEvent.getName(DataPortalEvent.preFetch),
              getEventArgs(DataPortalAction.fetch, method),
              self
          );
          // Execute fetch.
          var dto = null;
          if (extensions.dataFetch) {
            // *** Custom fetch.
            dto = extensions.dataFetch.call(self, getDataContext(connection), filter, method);
          } else {
            // *** Standard fetch.
            // Root element fetches data from repository.
            dto = dao.$runMethod(method, connection, filter);
          }
          // Load children.
          if (dto instanceof Array) {
            dto.forEach(function (data) {
              var item = itemType.load(self, data);
              items.push(item);
            });
          }
          // Launch finish event.
          self.emit(
              DataPortalEvent.getName(DataPortalEvent.postFetch),
              getEventArgs(DataPortalAction.fetch, method),
              self
          );
          // Close connection.
          connection = config.connectionManager.closeConnection(extensions.dataSource, connection);
        } catch (e) {
          // Wrap the intercepted error.
          var dpError = wrapError(DataPortalAction.fetch, e);
          // Launch finish event.
          self.emit(
              DataPortalEvent.getName(DataPortalEvent.postFetch),
              getEventArgs(DataPortalAction.fetch, method, dpError),
              self
          );
          // Close connection.
          connection = config.connectionManager.closeConnection(extensions.dataSource, connection);
          // Rethrow error.
          throw dpError;
        }
      }
    }

    //endregion

    //region Actions

    this.fetch = function(filter, method) {
      data_fetch(filter, method || M_FETCH);
    };

    //endregion

    //region Validation

    this.getBrokenRules = function(namespace) {
      return brokenRules.output(namespace);
    };

    //endregion

    //region Public array methods

    this.at = function (index) {
      return items[index];
    };

    this.forEach = function (callback) {
      items.forEach(callback);
    };

    this.every = function (callback) {
      return items.every(callback);
    };

    this.some = function (callback) {
      return items.some(callback);
    };

    this.filter = function (callback) {
      return items.filter(callback);
    };

    this.map = function (callback) {
      return items.map(callback);
    };

    this.sort = function (fnCompare) {
      return items.sort(fnCompare);
    };

    //endregion

    // Immutable object.
    Object.freeze(this);
  };
  util.inherits(ReadOnlyRootCollectionSync, CollectionBase);

  //region Factory methods

  ReadOnlyRootCollectionSync.fetch = function(filter, method) {
    var instance = new ReadOnlyRootCollectionSync();
    instance.fetch(filter, method);
    return instance;
  };

  //endregion

  ReadOnlyRootCollectionSync.modelType = 'ReadOnlyRootCollectionSync';

  return ReadOnlyRootCollectionSync;
};

module.exports = ReadOnlyRootCollectionSyncFactory;
