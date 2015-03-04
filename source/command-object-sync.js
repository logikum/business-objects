'use strict';

//region Imports

var util = require('util');
var config = require('./shared/configuration-reader.js');
var EnsureArgument = require('./system/ensure-argument.js');
var Enumeration = require('./system/enumeration.js');

var ModelBase = require('./model-base.js');
var ModelError = require('./shared/model-error.js');
var ExtensionManagerSync = require('./shared/extension-manager-sync.js');
var EventHandlerList = require('./shared/event-handler-list.js');
var DataStore = require('./shared/data-store.js');
var DataType = require('./data-types/data-type.js');

var PropertyInfo = require('./shared/property-info.js');
var PropertyManager = require('./shared/property-manager.js');
var PropertyContext = require('./shared/property-context.js');
var ValidationContext = require('./rules/validation-context.js');
var TransferContext = require('./shared/transfer-context.js');

var RuleManager = require('./rules/rule-manager.js');
var DataTypeRule = require('./rules/data-type-rule.js');
var BrokenRuleList = require('./rules/broken-rule-list.js');
var RuleSeverity = require('./rules/rule-severity.js');
var AuthorizationAction = require('./rules/authorization-action.js');
var AuthorizationContext = require('./rules/authorization-context.js');

var DataPortalAction = require('./shared/data-portal-action.js');
var DataPortalContext = require('./shared/data-portal-context.js');
var DataPortalEvent = require('./shared/data-portal-event.js');
var DataPortalEventArgs = require('./shared/data-portal-event-args.js');
var DataPortalError = require('./shared/data-portal-error.js');

var CLASS_NAME = 'CommandObjectSync';
var MODEL_DESC = 'Command object';
var M_EXECUTE = DataPortalAction.getName(DataPortalAction.execute);

//endregion

/**
 * Factory method to create definitions of synchronous command object models.
 *
 *    Valid child model types are:
 *
 *      * ReadOnlyChildModelSync
 *      * ReadOnlyChildCollectionSync
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
var CommandObjectSyncFactory = function (properties, rules, extensions) {

  properties = EnsureArgument.isMandatoryType(properties, PropertyManager,
      'c_manType', CLASS_NAME, 'properties');
  rules = EnsureArgument.isMandatoryType(rules, RuleManager,
      'c_manType', CLASS_NAME, 'rules');
  extensions = EnsureArgument.isMandatoryType(extensions, ExtensionManagerSync,
      'c_manType', CLASS_NAME, 'extensions');

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
   * @param {bo.shared.EventHandlerList} [eventHandlers] - The event handlers of the instance.
   *
   * @extends ModelBase
   *
   * @throws {@link bo.system.ArgumentError Argument error}:
   *    The event handlers must be an EventHandlerList object or null.
   *
   * @fires CommandObjectSync#preExecute
   * @fires CommandObjectSync#postExecute
   */
  var CommandObjectSync = function (eventHandlers) {
    ModelBase.call(this);

    eventHandlers = EnsureArgument.isOptionalType(eventHandlers, EventHandlerList,
        'c_optType', properties.name, 'eventHandlers');

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

    // Set up event handlers.
    if (eventHandlers)
      eventHandlers.setup(self);

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

    function childrenAreValid() {
      return properties.children().every(function(property) {
        var child = getPropertyValue(property);
        return child.isValid();
      });
    }

    function checkChildRules() {
      properties.children().forEach(function(property) {
        var child = getPropertyValue(property);
        child.checkRules();
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

    function raiseEvent (event, methodName, error) {
      self.emit(
          DataPortalEvent.getName(event),
          new DataPortalEventArgs(event, properties.name, null, methodName, error),
          self
      );
    }

    function wrapError (error) {
      return new DataPortalError(MODEL_DESC, properties.name, DataPortalAction.execute, error);
    }

    //endregion

    //region Execute

    function data_execute (method, isTransaction) {
      // Check permissions.
      if (method === M_EXECUTE ? canDo(AuthorizationAction.executeCommand) : canExecute(method)) {
        try {
          // Open connection/Start transaction.
          connection = isTransaction ?
              config.connectionManager.beginTransaction(extensions.dataSource) :
              config.connectionManager.openConnection(extensions.dataSource);
          // Launch start event.
          /**
           * The event arises before the command object will be executed in the repository.
           * @event CommandObjectSync#preExecute
           * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
           * @param {CommandObjectSync} oldObject - The instance of the model before the data portal action.
           */
          raiseEvent(DataPortalEvent.preExecute, method);
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
          raiseEvent(DataPortalEvent.postExecute, method);
          // Close connection/Finish transaction.
          connection = isTransaction ?
              config.connectionManager.commitTransaction(extensions.dataSource, connection) :
              config.connectionManager.closeConnection(extensions.dataSource, connection);
        } catch (e) {
          // Wrap the intercepted error.
          var dpError = wrapError(e);
          // Launch finish event.
          if (connection)
            raiseEvent(DataPortalEvent.postExecute, method, dpError);
          // Close connection/Undo transaction.
          connection = isTransaction ?
              config.connectionManager.rollbackTransaction(extensions.dataSource, connection) :
              config.connectionManager.closeConnection(extensions.dataSource, connection);
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
     * @param {boolean} [isTransaction] - Indicates whether transaction is required.
     *
     * @throws {@link bo.system.ArgumentError Argument error}:
     *      The method must be a string or null.
     * @throws {@link bo.system.ArgumentError Argument error}:
     *      The transaction indicator must be a Boolean value or null.
     * @throws {@link bo.rules.AuthorizationError Authorization error}:
     *      The user has no permission to execute the action.
     * @throws {@link bo.shared.DataPortalError Data portal error}:
     *      Executing the command object has failed.
     */
    this.execute = function(method, isTransaction) {

      if (typeof method === 'boolean' || method instanceof Boolean) {
        isTransaction = method;
        method = M_EXECUTE;
      }

      method = EnsureArgument.isOptionalString(method,
          'm_optString', CLASS_NAME, 'execute', 'method');
      isTransaction = EnsureArgument.isOptionalBoolean(isTransaction,
          'm_optBoolean', CLASS_NAME, 'execute', 'isTransaction');

      data_execute(method || M_EXECUTE, isTransaction);
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

      return brokenRules.isValid() && childrenAreValid();
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
        rules.validate(property, new ValidationContext(store, brokenRules));
      });
      checkChildRules();

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
      if (canBeRead(property)) {
        if (property.getter)
          return property.getter(getPropertyContext(property));
        else
          return store.getValue(property);
      } else
        return null;
    }

    function writePropertyValue(property, value) {
      if (canBeWritten(property)) {
        if (property.setter)
          property.setter(getPropertyContext(property), value);
        else
          store.setValue(property, value);
      }
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
            return readPropertyValue(property);
          },
          set: function (value) {
            if (property.isReadOnly)
              throw new ModelError('readOnly', properties.name, property.name);
            writePropertyValue(property, value);
          },
          enumerable: true
        });

        rules.add(new DataTypeRule(property));

      } else {
        // Child item/collection
        if (property.type.create) // Item
          store.initValue(property, property.type.create(self, eventHandlers));
        else                      // Collection
          store.initValue(property, new property.type(self, eventHandlers));

        Object.defineProperty(self, property.name, {
          get: function () {
            return readPropertyValue(property);
          },
          set: function (value) {
            throw new ModelError('readOnly', properties.name, property.name);
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
    get: function () { return CLASS_NAME; }
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
   * @param {bo.shared.EventHandlerList} [eventHandlers] - The event handlers of the instance.
   * @returns {CommandObjectSync} A new command object.
   *
   * @throws {@link bo.system.ArgumentError Argument error}:
   *      The event handlers must be an EventHandlerList object or null.
   */
  CommandObjectSync.create = function(eventHandlers) {
    return new CommandObjectSync(eventHandlers);
  };

  //endregion

  return CommandObjectSync;
};

module.exports = CommandObjectSyncFactory;
