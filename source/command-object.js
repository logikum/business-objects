'use strict';

//region Imports

var util = require('util');
var config = require('./shared/configuration-reader.js');
var Argument = require('./system/argument-check.js');
var Enumeration = require('./system/enumeration.js');

var ModelBase = require('./model-base.js');
var ModelError = require('./shared/model-error.js');
var ExtensionManager = require('./shared/extension-manager.js');
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
var BrokenRulesResponse = require('./rules/broken-rules-response.js');

var DataPortalAction = require('./shared/data-portal-action.js');
var DataPortalContext = require('./shared/data-portal-context.js');
var DataPortalEvent = require('./shared/data-portal-event.js');
var DataPortalEventArgs = require('./shared/data-portal-event-args.js');
var DataPortalError = require('./shared/data-portal-error.js');

var CLASS_NAME = 'CommandObject';
var MODEL_DESC = 'Command object';
var M_EXECUTE = DataPortalAction.getName(DataPortalAction.execute);

//endregion

/**
 * Factory method to create definitions of asynchronous command object models.
 *
 *    Valid child model types are:
 *
 *      * ReadOnlyChildObject
 *      * ReadOnlyChildCollection
 *
 * @function bo.CommandObject
 * @param {string} name - The name of the command.
 * @param {bo.shared.PropertyManager} properties - The property definitions.
 * @param {bo.shared.RuleManager} rules - The validation and authorization rules.
 * @param {bo.shared.ExtensionManager} extensions - The customization of the model.
 * @returns {CommandObject} The constructor of an asynchronous command object model.
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The command name must be a non-empty string.
 * @throws {@link bo.system.ArgumentError Argument error}: The properties must be a PropertyManager object.
 * @throws {@link bo.system.ArgumentError Argument error}: The rules must be a RuleManager object.
 * @throws {@link bo.system.ArgumentError Argument error}: The extensions must be a ExtensionManager object.
 *
 * @throws {@link bo.shared.ModelError Model error}:
 *    The child objects must be ReadOnlyChildObject or ReadOnlyChildCollection instances.
 */
var CommandObjectFactory = function (name, properties, rules, extensions) {
  var check = Argument.inConstructor(CLASS_NAME);

  name = check(name).forMandatory('name').asString();
  properties = check(properties).forMandatory('properties').asType(PropertyManager);
  rules = check(rules).forMandatory('rules').asType(RuleManager);
  extensions = check(extensions).forMandatory('extensions').asType(ExtensionManager);

  // Verify the model types of child objects.
  properties.modelName = name;
  properties.verifyChildTypes([ 'ReadOnlyChildObject', 'ReadOnlyChildCollection' ]);

  // Get data access object.
  var dao = extensions.getDataAccessObject(name);

  /**
   * @classdesc
   *    Represents the definition of an asynchronous command object model.
   * @description
   *    Creates a new asynchronous command object model instance.
   *
   *    _The name of the model type available as:
   *    __&lt;instance&gt;.constructor.modelType__, returns 'CommandObject'._
   *
   * @name CommandObject
   * @constructor
   * @param {bo.shared.EventHandlerList} [eventHandlers] - The event handlers of the instance.
   *
   * @extends ModelBase
   *
   * @throws {@link bo.system.ArgumentError Argument error}:
   *    The event handlers must be an EventHandlerList object or null.
   *
   * @fires CommandObject#preExecute
   * @fires CommandObject#postExecute
   */
  var CommandObject = function (eventHandlers) {
    ModelBase.call(this);

    eventHandlers = Argument.inConstructor(name)
        .check(eventHandlers).forOptional('eventHandlers').asType(EventHandlerList);

    var self = this;
    var store = new DataStore();
    var brokenRules = new BrokenRuleList(name);
    var isValidated = false;
    var propertyContext = null;
    var dataContext = null;

    // Set up business rules.
    rules.initialize(config.noAccessBehavior);

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

    function getChildBrokenRules (namespace, bro) {
      properties.children().forEach(function (property) {
        var child = getPropertyValue(property);
        var childBrokenRules = child.getBrokenRules(namespace);
        if (childBrokenRules) {
          if (childBrokenRules instanceof Array)
            bro.addChildren(property.name, childBrokenRules);
          else
            bro.addChild(property.name, childBrokenRules);
        }
      });
      return bro;
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
          new DataPortalEventArgs(event, name, null, methodName, error)
      );
    }

    function wrapError (error) {
      return new DataPortalError(MODEL_DESC, name, DataPortalAction.execute, error);
    }

    function runStatements (main, callback) {
      // Open connection.
      config.connectionManager.openConnection(
          extensions.dataSource, function (errOpen, connection) {
            if (errOpen)
              callback(wrapError(errOpen));
            else
              main(connection, function (err, result) {
                // Close connection.
                config.connectionManager.closeConnection(
                    extensions.dataSource, connection, function (errClose, connClosed) {
                      connection = connClosed;
                      if (err)
                        callback(wrapError(err));
                      else if (errClose)
                        callback(wrapError(errClose));
                      else
                        callback(null, result);
                    });
              });
          });
    }

    function runTransaction (main, callback) {
      // Start transaction.
      config.connectionManager.beginTransaction(
          extensions.dataSource, function (errBegin, connection) {
            if (errBegin)
              callback(wrapError(errBegin));
            else
              main(connection, function (err, result) {
                if (err)
                // Undo transaction.
                  config.connectionManager.rollbackTransaction(
                      extensions.dataSource, connection, function (errRollback, connClosed) {
                        connection = connClosed;
                        callback(wrapError(err));
                      });
                else
                // Finish transaction.
                  config.connectionManager.commitTransaction(
                      extensions.dataSource, connection, function (errCommit, connClosed) {
                        connection = connClosed;
                        if (errCommit)
                          callback(wrapError(errCommit));
                        else
                          callback(null, result);
                      });
              });
          });
    }

    //endregion

    //region Execute

    function data_execute (method, isTransaction, callback) {
      var hasConnection = false;
      // Helper function for post-execute actions.
      function finish (dto, cb) {
        // Fetch children as well.
        loadChildren(dto, function (err) {
          if (err)
            failed(err, cb);
          else {
            // Launch finish event.
            /**
             * The event arises after the command object has been executed in the repository.
             * @event CommandObject#postExecute
             * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
             * @param {CommandObject} newObject - The instance of the model after the data portal action.
             */
            raiseEvent(DataPortalEvent.postExecute, method);
            cb(null, self);
          }
        });
      }
      // Helper callback for failure.
      function failed (err, cb) {
        if (hasConnection) {
          // Launch finish event.
          var dpError = wrapError(err);
          raiseEvent(DataPortalEvent.postExecute, method, dpError);
        }
        cb(err);
      }
      // Main activity.
      function main (connection, cb) {
        hasConnection = connection !== null;
        // Launch start event.
        /**
         * The event arises before the command object will be executed in the repository.
         * @event CommandObject#preExecute
         * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
         * @param {CommandObject} oldObject - The instance of the model before the data portal action.
         */
        raiseEvent(DataPortalEvent.preExecute, method);
        // Execute command.
        if (extensions.dataExecute) {
          // *** Custom execute.
          extensions.dataExecute.call(self, getDataContext(connection), method, function (err, dto) {
            if (err)
              failed(err, cb);
            else
              finish(dto, cb);
          });
        } else {
          // *** Standard execute.
          var dto = toDto.call(self);
          dao.$runMethod(method, connection, dto, function (err, dto) {
            if (err)
              failed(err, cb);
            else {
              fromDto.call(self, dto);
              finish(dto, cb);
            }
          });
        }
      }
      // Check permissions.
      if (method === M_EXECUTE ? canDo(AuthorizationAction.executeCommand) : canExecute(method)) {
        if (isTransaction)
          runTransaction(main, callback);
        else
          runStatements(main, callback);
      }
      else
        callback(null, self);
    }

    //endregion

    //endregion

    //region Actions

    /**
     * Executes the business object's statements in the repository.
     * <br/>_If method is not an empty string, &lt;instance&gt;.execute(method)
     * can be called as &lt;instance&gt;.method() as well._
     *
     * @function CommandObject#execute
     * @param {string} [method] - An alternative execute method of the data access object.
     * @param {boolean} [isTransaction] - Indicates whether transaction is required.
     * @param {external.cbDataPortal} callback - Returns the command object with the result.
     *
     * @throws {@link bo.system.ArgumentError Argument error}:
     *      The method must be a string or null.
     * @throws {@link bo.system.ArgumentError Argument error}:
     *      The transaction indicator must be a Boolean value or null.
     * @throws {@link bo.system.ArgumentError Argument error}:
     *      The callback must be a function.
     * @throws {@link bo.rules.AuthorizationError Authorization error}:
     *      The user has no permission to execute the action.
     */
    this.execute = function(method, isTransaction) {
      return new Promise( (fulfill, reject) => {
        var check = Argument.inMethod(name, 'execute');

        if (typeof method === 'boolean' || method instanceof Boolean) {
          isTransaction = method;
          method = M_EXECUTE;
        }

        method = check(method).forOptional('method').asString();
        isTransaction = check(isTransaction).forOptional('isTransaction').asBoolean();

        data_execute( method || M_EXECUTE, isTransaction, function( err, res ) {
          if (err) reject( err );
          else fulfill( res );
        });
      });
    };

    //endregion

    //region Validation

    /**
     * Indicates whether all the validation rules of the command object, including
     * the ones of its child objects, succeeds. A valid command object may have
     * broken rules with severity of success, information and warning.
     *
     * @function CommandObject#isValid
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
     * @function CommandObject#checkRules
     */
    this.checkRules = function() {
      brokenRules.clear();

      var context = new ValidationContext(store, brokenRules);
      properties.forEach(function(property) {
        rules.validate(property, context);
      });
      checkChildRules();

      isValidated = true;
    };

    /**
     * Gets the broken rules of the command object.
     *
     * @function CommandObject#getBrokenRules
     * @param {string} [namespace] - The namespace of the message keys when messages are localizable.
     * @returns {bo.rules.BrokenRulesOutput} The broken rules of the business object.
     */
    this.getBrokenRules = function(namespace) {
      var bro = brokenRules.output(namespace);
      bro = getChildBrokenRules(namespace, bro);
      return bro.$length ? bro : null;
    };

    /**
     * Gets the response to send to the client in case of broken rules.
     *
     * @function CommandObject#getResponse
     * @param {string} [message] - Human-readable description of the reason of the failure.
     * @param {string} [namespace] - The namespace of the message keys when messages are localizable.
     * @returns {bo.rules.BrokenRulesResponse} The broken rules response to send to the client.
     */
    this.getResponse = function (message, namespace) {
      var output = this.getBrokenRules(namespace);
      return output ? new BrokenRulesResponse(output, message) : null;
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
        propertyContext = new PropertyContext(
            name, properties.toArray(), readPropertyValue, writePropertyValue);
      return propertyContext.with(primaryProperty);
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
              throw new ModelError('readOnly', name, property.name);
            writePropertyValue(property, value);
          },
          enumerable: true
        });

        rules.add(new DataTypeRule(property));

      } else {
        // Child item/collection
        if (property.type.create) // Item
          property.type.create(self, eventHandlers, function (err, item) {
            store.initValue(property, item);
          });
        else                      // Collection
          store.initValue(property, new property.type(self, eventHandlers));

        Object.defineProperty(self, property.name, {
          get: function () {
            return readPropertyValue(property);
          },
          set: function (value) {
            throw new ModelError('readOnly', name, property.name);
          },
          enumerable: false
        });
      }
    });

    // Add other execute methods to the instance.
    extensions.buildOtherMethods(self, false);

    //endregion

    // Immutable object.
    Object.freeze(this);
  };
  util.inherits(CommandObject, ModelBase);

  /**
   * The name of the model type.
   *
   * @property {string} CommandObject.constructor.modelType
   * @default CommandObject
   * @readonly
   */
  Object.defineProperty(CommandObject, 'modelType', {
    get: function () { return CLASS_NAME; }
  });

  /**
   * The name of the model. However, it can be hidden by a model property with the same name.
   *
   * @name CommandObject#$modelName
   * @type {string}
   * @readonly
   */
  CommandObject.prototype.$modelName = name;

  //region Factory methods

  /**
   * Creates a new command object instance.
   *
   * @function CommandObject.create
   * @param {bo.shared.EventHandlerList} [eventHandlers] - The event handlers of the instance.
   * @param {external.cbDataPortal} callback - Returns a new command object.
   *
   * @throws {@link bo.system.ArgumentError Argument error}:
   *      The event handlers must be an EventHandlerList object or null.
   * @throws {@link bo.system.ArgumentError Argument error}:
   *      The callback must be a function.
   */
  CommandObject.create = function(eventHandlers) {
    return new CommandObject(eventHandlers);
  };

  //endregion

  return CommandObject;
};

module.exports = CommandObjectFactory;
