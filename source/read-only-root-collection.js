'use strict';

var util = require('util');
var CollectionBase = require('./collection-base.js');
var config = require('./shared/config-reader.js');
var ensureArgument = require('./shared/ensure-argument.js');

var ExtensionManager = require('./shared/extension-manager.js');
var DataContext = require('./shared/data-context.js');
var UserInfo = require('./shared/user-info.js');
var RuleManager = require('./rules/rule-manager.js');
var BrokenRuleList = require('./rules/broken-rule-list.js');
var Action = require('./rules/authorization-action.js');
var AuthorizationContext = require('./rules/authorization-context.js');

var ReadOnlyRootCollectionCreator = function(name, itemType, rules, extensions) {

  name = ensureArgument.isMandatoryString(name,
    'The name argument of ReadOnlyRootCollectionCreator must be a non-empty string.');
  itemType = ensureArgument.isMandatoryFunction(itemType,
    'The itemType argument of ReadOnlyRootCollectionCreator must be an ReadOnlyRootModel type.');
  rules = ensureArgument.isMandatoryType(rules, RuleManager,
    'Argument rules of ReadOnlyRootCollectionCreator must be a RuleManager object.');
  extensions = ensureArgument.isMandatoryType(extensions, ExtensionManager,
    'Argument extensions of ReadOnlyRootCollectionCreator must be an ExtensionManager object.');

  var ReadOnlyRootCollection = function () {

    var self = this;
    var items = [];
    var brokenRules = new BrokenRuleList(name);
    var dao = null;
    var user = null;
    var dataContext = null;

    this.name = name;

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

    function getDataContext() {
      if (!dataContext)
        dataContext = new DataContext(dao, user);
      return dataContext;
    }

    function data_fetch (filter, method, callback) {
      // Helper function for post-fetch actions.
      function finish (err, data) {
        if (err)
          callback(err);
        else {
          // Load children.
          if (data instanceof Array && data.length) {
            data.forEach(function (dto) {
              var count = 0;
              var error = null;
              itemType.load(self, dto, function (err, item) {
                if (err)
                  error = error || err;
                else
                  items.push(item);
                // Check if all items are done.
                if (++count === data.length) {
                  callback(error);
                }
              });
            });
          } else
            callback(null, self);
        }
      }
      // Check permissions.
      if (method === 'fetch' ? canDo(Action.fetchObject) : canExecute(method)) {
        if (extensions.dataFetch) {
          // Custom fetch.
          extensions.dataFetch.call(self, getDataContext(), filter, method, finish);
        } else {
          // Standard fetch.
          // Root element fetches data from repository.
          dao.checkMethod(method);
          dao[method](filter, finish);
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
  util.inherits(ReadOnlyRootCollection, CollectionBase);

  //region Factory methods

  ReadOnlyRootCollection.fetch = function(filter, method, callback) {
    if (!callback) {
      callback = method;
      method = undefined;
    }
    var instance = new ReadOnlyRootCollection();
    instance.fetch(filter, method, function (err) {
      if (err)
        callback(err);
      else
        callback(null, instance);
    });
  };

  //endregion

  return ReadOnlyRootCollection;
};

module.exports = ReadOnlyRootCollectionCreator;
