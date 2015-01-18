/**
 * Synchronous read-only root collection module.
 * @module read-only-root-collection-sync
 */
'use strict';

var util = require('util');
var CollectionBase = require('./collection-base.js');
var ModelBase = require('./model-base.js');
var config = require('./shared/config-reader.js');
var ensureArgument = require('./shared/ensure-argument.js');

var ExtensionManagerSync = require('./shared/extension-manager-sync.js');
var DataContext = require('./shared/data-context.js');
var RuleManager = require('./rules/rule-manager.js');
var BrokenRuleList = require('./rules/broken-rule-list.js');
var Action = require('./rules/authorization-action.js');
var AuthorizationContext = require('./rules/authorization-context.js');

var ReadOnlyRootCollectionSyncCreator = function(name, itemType, rules, extensions) {

  name = ensureArgument.isMandatoryString(name,
      'c_manString', 'ReadOnlyRootCollectionSyncCreator', 'name');
  itemType = ensureArgument.isMandatoryType(itemType, ModelBase,
      'c_itemType', 'ReadOnlyRootCollectionSyncCreator', 'ReadOnlyChildModelSync');
  rules = ensureArgument.isMandatoryType(rules, RuleManager,
      'c_manType', 'ReadOnlyRootCollectionSyncCreator', 'rules');
  extensions = ensureArgument.isMandatoryType(extensions, ExtensionManagerSync,
      'c_manType', 'ReadOnlyRootCollectionSyncCreator', 'extensions');

  var ReadOnlyRootCollectionSync = function () {

    var self = this;
    var items = [];
    var brokenRules = new BrokenRuleList(name);
    var dao = null;
    var user = null;
    var dataContext = null;
    var connection = null;

    this.name = name;

    // Get data access object.
    if (extensions.daoBuilder)
      dao = extensions.daoBuilder(extensions.dataSource, extensions.modelPath);
    else
      dao = config.daoBuilder(extensions.dataSource, extensions.modelPath);

    // Get principal.
    user = config.getUser();

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
      return new AuthorizationContext(action, targetName || '', user, brokenRules);
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

    function getDataContext(connection) {
      if (!dataContext)
        dataContext = new DataContext(dao, user);
      return dataContext.setState(connection, false);
    }

    function data_fetch (filter, method) {
      // Check permissions.
      if (method === 'fetch' ? canDo(Action.fetchObject) : canExecute(method)) {
        try {
          // Open connection.
          connection = config.connectionManager.openConnection(extensions.dataSource);
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
        } finally {
          // Close connection.
          connection = config.connectionManager.closeConnection(extensions.dataSource, connection);
        }
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

  return ReadOnlyRootCollectionSync;
};

module.exports = ReadOnlyRootCollectionSyncCreator;
