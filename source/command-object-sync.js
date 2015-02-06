'use strict';

//region Imports

var util = require('util');
var config = require('./shared/configuration-reader.js');
var EnsureArgument = require('./system/ensure-argument.js');
var Enumeration = require('./system/enumeration.js');

var ModelBase = require('./model-base.js');
var ModelError = require('./shared/model-error.js');
var ExtensionManagerSync = require('./shared/extension-manager-sync.js');
var DataStore = require('./shared/data-store.js');
var DataType = require('./data-types/data-type.js');

var PropertyInfo = require('./shared/property-info.js');
var PropertyManager = require('./shared/property-manager.js');
var PropertyContext = require('./shared/property-context.js');
var ValidationContext = require('./rules/validation-context.js');
var TransferContext = require('./shared/transfer-context.js');

var RuleManager = require('./rules/rule-manager.js');
var BrokenRuleList = require('./rules/broken-rule-list.js');
var RuleSeverity = require('./rules/rule-severity.js');
var AuthorizationAction = require('./rules/authorization-action.js');
var AuthorizationContext = require('./rules/authorization-context.js');

var DataPortalAction = require('./shared/data-portal-action.js');
var DataPortalContext = require('./shared/data-portal-context.js');
var DataPortalEvent = require('./shared/data-portal-event.js');
var DataPortalEventArgs = require('./shared/data-portal-event-args.js');
var DataPortalError = require('./shared/data-portal-error.js');

var MODEL_DESC = 'Command object';
var M_EXECUTE = DataPortalAction.getName(DataPortalAction.execute);

//endregion

/**
 * Factory method to create definitions of synchronous command object models.
 *
 * @function bo.CommandObjectSync
 * @param {bo.shared.PropertyManager} properties - The property definitions.
 * @param {bo.shared.RuleManager} rules - The validation and authorization rules.
 * @param {bo.shared.ExtensionManagerSync} extensions - The customization of the model.
 * @returns {CommandObjectSync} The constructor of a synchronous command object model.
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The properties must be a PropertyManager object.
 * @throws {@link bo.system.ArgumentError Argument error}: The rules must be a RuleManager object.
 * @throws {@link bo.system.ArgumentError Argument error}: The extensions must be a ExtensionManagerSync object.
 *
 * @throws {@link bo.shared.ModelError Model error}:
 *    The child objects must be ReadOnlyChildModelSync or ReadOnlyChildCollectionSync instances.
 */
var CommandObjectSyncFactory = function(properties, rules, extensions) {

  properties = EnsureArgument.isMandatoryType(properties, PropertyManager,
      'c_manType', 'CommandObjectSync', 'properties');
  rules = EnsureArgument.isMandatoryType(rules, RuleManager,
      'c_manType', 'CommandObjectSync', 'rules');
  extensions = EnsureArgument.isMandatoryType(extensions, ExtensionManagerSync,
      'c_manType', 'CommandObjectSync', 'extensions');

  // Verify the model types of child models.
  properties.verifyChildTypes([ 'ReadOnlyChildModelSync', 'ReadOnlyChildCollectionSync' ]);

  /**
   * @classdesc
   *    Represents the definition of a synchronous command object model.
   * @description
   *    Creates a new synchronous command object model instance.
   *
   *    _The name of the model type available as:
   *    __&lt;instance&gt;.constructor.modelType__, returns 'CommandObjectSync'._
   *
   * @name CommandObjectSync
   * @constructor
   *
   * @extends ModelBase
   *
   * @fires CommandObjectSync#preExecute
   * @fires CommandObjectSync#postExecute
   */
  var CommandObjectSync = function() {
    ModelBase.call(this);

    var self = this;
    var store = new DataStore();
    var brokenRules = new BrokenRuleList(properties.name);
    var isValidated = false;
    var dao = null;
    var propertyContext = null;
    var dataContext = null;
    var connection = null;

    // Set up business rules.
    rules.initialize(config.noAccessBehavior);

    // Get data access object.
    if (extensions.daoBuilder)
      dao = extensions.daoBuilder(extensions.dataSource, extensions.modelPath);
    else
      dao = config.daoBuilder(extensions.dataSource, extensions.modelPath);

    //region Transfer object methods

    function getTransferContext () {
      return new TransferContext(properties.toArray(), getPropertyValue, setPropertyValue);
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
      return new AuthorizationContext(action, targetName || '', brokenRules);
    }

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

    //endregion

    //region Child methods

    function loadChildren(dto) {
      properties.children().forEach(function(property) {
        var child = getPropertyValue(property);
        child.fetch(dto[property.name]);
      });
    }

    //endregion

    //region Data portal methods

    //region Helper

    function getDataContext (connection) {
      if (!dataContext)
        dataContext = new DataPortalContext(
          dao, properties.toArray(), getPropertyValue, setPropertyValue
        );
      return dataContext.setState(connection, false);
    }

    function getEventArgs (action, methodName, error) {
      return new DataPortalEventArgs(properties.name, action, methodName, error);
    }

    function wrapError (action, error) {
      return new DataPortalError(MODEL_DESC, properties.name, action, error);
    }

    //endregion

    //region Execute

    function data_execute (method) {
      // Check permissions.
      if (method === M_EXECUTE ? canDo(AuthorizationAction.executeCommand) : canExecute(method)) {
        try {
          // Start transaction.
          connection = config.connectionManager.beginTransaction(extensions.dataSource);
          // Launch start event.
          /**
           * The event arises before the command object will be executed in the repository.
           * @event CommandObjectSync#preExecute
           * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
           * @param {CommandObjectSync} oldObject - The instance of the model before the data portal action.
           */
          self.emit(
              DataPortalEvent.getName(DataPortalEvent.preExecute),
              getEventArgs(DataPortalAction.execute, method),
              self
          );
          // Execute command.
          var dto = {};
          if (extensions.dataExecute) {
            // *** Custom execute.
            dto = extensions.dataExecute.call(self, getDataContext(connection), method);
          } else {
            // *** Standard execute.
            dto = toDto.call(self);
            dto = dao.$runMethod(method, connection, dto);
            fromDto.call(self, dto);
          }
          // Load children as well.
          loadChildren(dto);
          // Launch finish event.
          /**
           * The event arises after the command object has been executed in the repository.
           * @event CommandObjectSync#postExecute
           * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
           * @param {CommandObjectSync} newObject - The instance of the model after the data portal action.
           */
          self.emit(
              DataPortalEvent.getName(DataPortalEvent.postExecute),
              getEventArgs(DataPortalAction.execute, method),
              self
          );
          // Finish transaction.
          connection = config.connectionManager.commitTransaction(extensions.dataSource, connection);
        } catch (e) {
          // Wrap the intercepted error.
          var dpError = wrapError(DataPortalAction.execute, e);
          // Launch finish event.
          if (connection) {
            self.emit(
                DataPortalEvent.getName(DataPortalEvent.postExecute),
                getEventArgs(DataPortalAction.execute, method, dpError),
                self
            );
          }
          // Undo transaction.
          connection = config.connectionManager.rollbackTransaction(extensions.dataSource, connection);
          // Rethrow error.
          throw dpError;
        }
      }
    }

    //endregion

    //endregion

    //region Actions

    /**
     * Executes the business object's statements in the repository.
     * <br/>_If method is not an empty string, &lt;instance&gt;.execute(method)
     * can be called as &lt;instance&gt;.method() as well._
     *
     * @function CommandObjectSync#execute
     * @param {string} [method] - An alternative execute method of the data access object.
     *
     * @throws {@link bo.rules.AuthorizationError Authorization error}:
     *      The user has no permission to execute the action.
     */
    this.execute = function(method) {
      data_execute(method || M_EXECUTE);
    };

    //endregion

    //region Validation

    /**
     * Indicates whether all the validation rules of the command object, including
     * the ones of its child objects, succeeds. A valid command object may have
     * broken rules with severity of success, information and warning.
     *
     * @function CommandObjectSync#isValid
     * @returns {boolean} True when the command object is valid, otherwise false.
     */
    this.isValid = function() {
      if (!isValidated)
        this.checkRules();

      return brokenRules.isValid();
    };

    /**
     * Executes all the validation rules of the command object, including the ones
     * of its child objects.
     *
     * @function CommandObjectSync#checkRules
     */
    this.checkRules = function() {
      brokenRules.clear();

      properties.forEach(function(property) {
        rules.validate(property, new ValidationContext(getPropertyValue, brokenRules));
      });
      isValidated = true;
    };

    /**
     * Gets the broken rules of the command object.
     *
     * @function CommandObjectSync#getBrokenRules
     * @param {string} [namespace] - The namespace of the message keys when messages are localizable.
     * @returns {bo.rules.BrokenRulesOutput} The broken rules of the business object.
     */
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

    function getPropertyContext(primaryProperty) {
      if (!propertyContext)
        propertyContext = new PropertyContext(properties.toArray(), readPropertyValue, writePropertyValue);
      return propertyContext.with(primaryProperty);
    }

    properties.map(function (property) {

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
            if (property.isReadOnly)
              throw new ModelError('readOnly', properties.name , property.name);
            if (property.setter)
              property.setter(getPropertyContext(property), value);
            else
              writePropertyValue(property, value);
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
            throw new ModelError('readOnly', properties.name , property.name);
          },
          enumerable: false
        });
      }
    });

    if (extensions.methods) {
      extensions.methods.map(function (methodName) {
        self[methodName] = function () {
          self.execute(methodName);
        };
      });
    }

    //endregion

    // Immutable object.
    Object.freeze(this);
  };
  util.inherits(CommandObjectSync, ModelBase);

  /**
   * The name of the model type.
   *
   * @property {string} CommandObjectSync.constructor.modelType
   * @default CommandObjectSync
   * @readonly
   */
  Object.defineProperty(CommandObjectSync, 'modelType', {
    get: function () { return 'CommandObjectSync'; }
  });
  /**
   * The name of the model. However, it can be hidden by a model property with the same name.
   *
   * @name CommandObjectSync#$modelName
   * @type {string}
   * @readonly
   */
  CommandObjectSync.prototype.$modelName = properties.name;

  //region Factory methods

  /**
   * Creates a new command object instance.
   *
   * @function CommandObjectSync.create
   * @returns {CommandObjectSync} A new command object.
   */
  CommandObjectSync.create = function() {
    return new CommandObjectSync();
  };

  //endregion

  return CommandObjectSync;
};

module.exports = CommandObjectSyncFactory;
