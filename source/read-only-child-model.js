'use strict';

//region Imports

var util = require('util');
var config = require('./shared/configuration-reader.js');
var EnsureArgument = require('./system/ensure-argument.js');
var Enumeration = require('./system/enumeration.js');

var ModelBase = require('./model-base.js');
var ModelError = require('./shared/model-error.js');
var ExtensionManager = require('./shared/extension-manager.js');
var DataStore = require('./shared/data-store.js');
var DataType = require('./data-types/data-type.js');

var PropertyInfo = require('./shared/property-info.js');
var PropertyManager = require('./shared/property-manager.js');
var PropertyContext = require('./shared/property-context.js');
var TransferContext = require('./shared/transfer-context.js');

var RuleManager = require('./rules/rule-manager.js');
var BrokenRuleList = require('./rules/broken-rule-list.js');
var RuleSeverity = require('./rules/rule-severity.js');
var Action = require('./rules/authorization-action.js');
var AuthorizationContext = require('./rules/authorization-context.js');

var DataPortalAction = require('./shared/data-portal-action.js');
var DataPortalContext = require('./shared/data-portal-context.js');
var DataPortalEvent = require('./shared/data-portal-event.js');
var DataPortalEventArgs = require('./shared/data-portal-event-args.js');
var DataPortalError = require('./shared/data-portal-error.js');

var M_FETCH = DataPortalAction.getName(DataPortalAction.fetch);

//endregion

/**
 * Factory method to create definitions of asynchronous read-only child models.
 *
 * @function bo.ReadOnlyChildModel
 * @param {bo.shared.PropertyManager} properties - The property definitions.
 * @param {bo.shared.RuleManager} rules - The validation and authorization rules.
 * @param {bo.shared.ExtensionManager} extensions - The customization of the model.
 * @returns {ReadOnlyChildModel} The constructor of an asynchronous read-only child model.
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The properties must be a PropertyManager object.
 * @throws {@link bo.system.ArgumentError Argument error}: The rules must be a RuleManager object.
 * @throws {@link bo.system.ArgumentError Argument error}: The extensions must be a ExtensionManager object.
 */
var ReadOnlyChildModelFactory = function(properties, rules, extensions) {

  properties = EnsureArgument.isMandatoryType(properties, PropertyManager,
      'c_manType', 'ReadOnlyChildModel', 'properties');
  rules = EnsureArgument.isMandatoryType(rules, RuleManager,
      'c_manType', 'ReadOnlyChildModel', 'rules');
  extensions = EnsureArgument.isMandatoryType(extensions, ExtensionManager,
      'c_manType', 'ReadOnlyChildModel', 'extensions');

  // Verify the model type of child models.
  properties.verifyChildTypes([ 'ReadOnlyChildCollection', 'ReadOnlyChildModel' ]);

  /**
   * @classdesc Represents the definition of an asynchronous read-only child model.
   * @description Creates a new asynchronous read-only child model instance.
   *
   * @name ReadOnlyChildModel
   * @constructor
   *
   * @extends ModelBase
   */
  var ReadOnlyChildModel = function(parent) {
    ModelBase.call(this);

    // Verify the model type of the parent model.
    parent = EnsureArgument.isModelType(parent,
        [
          'ReadOnlyRootCollection',
          'ReadOnlyChildCollection',
          'ReadOnlyRootModel',
          'ReadOnlyChildModel',
          'CommandObject'
        ],
        'c_modelType', properties.name, 'parent');

    var self = this;
    var store = new DataStore();
    var brokenRules = new BrokenRuleList(properties.name);
    var propertyContext = null;
    var dataContext = null;

    // Set up business rules.
    rules.initialize(config.noAccessBehavior);

    //region Transfer object methods

    function getTransferContext (authorize) {
      return authorize ?
          new TransferContext(properties.toArray(), readPropertyValue, null) :
          new TransferContext(properties.toArray(), null, setPropertyValue);
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
        extensions.fromDto.call(self, getTransferContext(false), dto);
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
        cto = extensions.toCto.call(self, getTransferContext(true));
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
      return new AuthorizationContext(action, targetName || '', brokenRules);
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

    function getDataContext () {
      if (!dataContext)
        dataContext = new DataPortalContext(
          null, properties.toArray(), getPropertyValue, setPropertyValue
        );
      return dataContext.setState(null, false);
    }

    function getEventArgs (action, methodName, error) {
      return new DataPortalEventArgs(properties.name, action, methodName, error);
    }

    function wrapError (action, error) {
      return new DataPortalError(MODEL_DESC, properties.name, action, error);
    }

    function data_fetch (filter, method, callback) {
      // Helper function for post-fetch actions.
      function finish (dto, cb) {
        // Fetch children as well.
        fetchChildren(dto, function (err) {
          if (err)
            failed(err, cb);
          else {
            // Launch finish event.
            self.emit(
                DataPortalEvent.getName(DataPortalEvent.postFetch),
                getEventArgs(DataPortalAction.fetch, method),
                self
            );
            cb(null, self);
          }
        });
      }
      // Helper callback for failure.
      function failed (err, cb) {
        // Launch finish event.
        var dpError = wrapError(DataPortalAction.fetch, err);
        self.emit(
            DataPortalEvent.getName(DataPortalEvent.postFetch),
            getEventArgs(DataPortalAction.fetch, method, dpError),
            self
        );
        cb(err);
      }
      // Check permissions.
      if (method === M_FETCH ? canDo(Action.fetchObject) : canExecute(method)) {
        // Launch start event.
        self.emit(
            DataPortalEvent.getName(DataPortalEvent.preFetch),
            getEventArgs(DataPortalAction.fetch, method),
            self
        );
        // Execute fetch.
        if (extensions.dataFetch) {
          // Custom fetch.
          extensions.dataFetch.call(self, getDataContext(), filter, method, function (err, dto) {
            if (err)
              failed(err, callback);
            else
              finish(dto, callback);
          });
        } else {
          // Standard fetch.
          // Child element gets data from parent.
          fromDto.call(self, filter);
          finish(filter, callback);
        }
      } else
        callback(null, self);
    }

    //endregion

    //region Actions

    this.fetch = function(filter, method, callback) {
      data_fetch(filter, method || M_FETCH, callback);
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
    }

    function readPropertyValue(property) {
      if (canBeRead(property))
        return store.getValue(property);
      else
        return null;
    }

    function getPropertyContext(primaryProperty) {
      if (!propertyContext)
        propertyContext = new PropertyContext(properties.toArray(), readPropertyValue);
      return propertyContext.with(primaryProperty);
    }

    properties.map(function(property) {

      if (property.type instanceof DataType) {
        // Normal property
        store.initValue(property);

        Object.defineProperty(self, property.name, {
          get: function () {
            if (property.getter)
              return property.getter(getPropertyContext(property));
            else
              return readPropertyValue(property);
          },
          set: function (value) {
            throw new ModelError('readOnly', properties.name , property.name);
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

    //endregion

    // Immutable object.
    Object.freeze(this);
  };
  util.inherits(ReadOnlyChildModel, ModelBase);

  ReadOnlyChildModel.modelType = 'ReadOnlyChildModel';
  ReadOnlyChildModel.prototype.name = properties.name;

  //region Factory methods

  ReadOnlyChildModel.load = function(parent, data, callback) {
    var instance = new ReadOnlyChildModel(parent);
    instance.fetch(data, undefined, function (err) {
      if (err)
        callback(err);
      else
        callback(null, instance);
    });
  };

  //endregion

  return ReadOnlyChildModel;
};

module.exports = ReadOnlyChildModelFactory;
