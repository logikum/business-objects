/**
 * Asynchronous command object module.
 * @module command-object
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

var CommandObjectCreator = function(properties, rules, extensions) {

  properties = ensureArgument.isMandatoryType(properties, PropertyManager,
      'c_manType', 'CommandObjectCreator', 'properties');
  rules = ensureArgument.isMandatoryType(rules, RuleManager,
      'c_manType', 'CommandObjectCreator', 'rules');
  extensions = ensureArgument.isMandatoryType(extensions, ExtensionManager,
      'c_manType', 'CommandObjectCreator', 'extensions');

  var CommandObject = function() {

    var self = this;
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

    function loadChildren(dto, callback) {
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
      if (!dataContext)
        dataContext = new DataContext(
            dao, user, false, properties.toArray(), getPropertyValue, setPropertyValue
        );
      return dataContext.setSelfDirty(false);
    }

    function data_execute (method, callback) {
      // Helper function for post-execute actions.
      function finish (dto) {
        // Fetch children as well.
        loadChildren(dto, function (err) {
          if (err)
            callback(err);
          else
            callback(null, self);
        });
      }
      // Check permissions.
      if (method === 'execute' ? canDo(Action.executeCommand) : canExecute(method)) {
        if (extensions.dataExecute) {
          // Custom execute.
          extensions.dataExecute.call(self, getDataContext(), method, function (err, dto) {
            if (err)
              callback(err);
            else
              finish(dto);
          });
        } else {
          // Standard execute.
          var dto = toDto.call(self);
          dao.checkMethod(method);
          dao[method](dto, function (err, dto) {
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

    //endregion

    //region Actions

    this.execute = function(method, callback) {
      if (!callback) {
        callback = method;
        method = null;
      }
      data_execute(method || 'execute', callback);
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
      store.setValue(property, value);
    }

    function readPropertyValue(property) {
      if (canBeRead(property))
        return store.getValue(property);
      else
        return null;
    }

    function writePropertyValue(property, value) {
      if (canBeWritten(property))
        store.setValue(property, value);
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

    if (extensions.methods) {
      extensions.methods.map(function (methodName) {
        self[methodName] = function (callback) {
          self.execute(methodName, callback);
        };
      });
    }

    //endregion

    // Immutable object.
    Object.freeze(this);
  };
  util.inherits(CommandObject, ModelBase);

  CommandObject.prototype.name = properties.name;

  //region Factory methods

  CommandObject.create = function(callback) {
    var instance = new CommandObject();
    callback(null, instance);
  };

  //endregion

  return CommandObject;
};

module.exports = CommandObjectCreator;
