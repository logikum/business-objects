'use strict';

//region Imports

var util = require('util');
var config = require('./shared/configuration-reader.js');
var Argument = require('./system/argument-check.js');
var Enumeration = require('./system/enumeration.js');

var ModelBase = require('./model-base.js');
var ModelError = require('./shared/model-error.js');
var ExtensionManagerSync = require('./shared/extension-manager.js');
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

var CLASS_NAME = 'ReadOnlyChildObjectSync';
var M_FETCH = DataPortalAction.getName(DataPortalAction.fetch);

//endregion

/**
 * Factory method to create definitions of synchronous read-only child objects.
 *
 *    Valid child model types are:
 *
 *      * ReadOnlyChildCollectionSync
 *      * ReadOnlyChildObjectSync
 *
 * @function bo.ReadOnlyChildObjectSync
 * @param {string} name - The name of the model.
 * @param {bo.shared.PropertyManager} properties - The property definitions.
 * @param {bo.shared.RuleManager} rules - The validation and authorization rules.
 * @param {bo.shared.ExtensionManager} extensions - The customization of the model.
 * @returns {ReadOnlyChildObjectSync} The constructor of a synchronous read-only child object.
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The model name must be a non-empty string.
 * @throws {@link bo.system.ArgumentError Argument error}: The properties must be a PropertyManager object.
 * @throws {@link bo.system.ArgumentError Argument error}: The rules must be a RuleManager object.
 * @throws {@link bo.system.ArgumentError Argument error}: The extensions must be a ExtensionManagerSync object.
 *
 * @throws {@link bo.shared.ModelError Model error}:
 *    The child objects must be ReadOnlyChildCollectionSync or ReadOnlyChildObjectSync instances.
 */
var ReadOnlyChildObjectSyncFactory = function (name, properties, rules, extensions) {
  var check = Argument.inConstructor(CLASS_NAME);

  name = check(name).forMandatory('name').asString();
  properties = check(properties).forMandatory('properties').asType(PropertyManager);
  rules = check(rules).forMandatory('rules').asType(RuleManager);
  extensions = check(extensions).forMandatory('extensions').asType(ExtensionManagerSync);

  // Verify the model type of child objects.
  properties.modelName = name;
  properties.verifyChildTypes([ 'ReadOnlyChildCollectionSync', 'ReadOnlyChildObjectSync' ]);

  /**
   * @classdesc
   *    Represents the definition of a synchronous read-only child object.
   * @description
   *    Creates a new synchronous read-only child object instance.
   *
   *    _The name of the model type available as:
   *    __&lt;instance&gt;.constructor.modelType__, returns 'ReadOnlyChildObjectSync'._
   *
   *    Valid parent model types are:
   *
   *      * ReadOnlyRootCollectionSync
   *      * ReadOnlyChildCollectionSync
   *      * ReadOnlyRootObjectSync
   *      * ReadOnlyChildObjectSync
   *      * CommandObjectSync
   *
   * @name ReadOnlyChildObjectSync
   * @constructor
   * @param {object} parent - The parent business object.
   * @param {bo.shared.EventHandlerList} [eventHandlers] - The event handlers of the instance.
   *
   * @extends ModelBase
   *
   * @throws {@link bo.system.ArgumentError Argument error}:
   *    The parent object must be a ReadOnlyRootCollectionSync, ReadOnlyChildCollectionSync,
   *    ReadOnlyRootObjectSync, ReadOnlyChildObjectSync or CommandObjectSync instance.
   * @throws {@link bo.system.ArgumentError Argument error}:
   *    The event handlers must be an EventHandlerList object or null.
   *
   * @fires ReadOnlyChildObjectSync#preFetch
   * @fires ReadOnlyChildObjectSync#postFetch
   */
  var ReadOnlyChildObjectSync = function (parent, eventHandlers) {
    ModelBase.call(this);
    var check = Argument.inConstructor(name);

    // Verify the model type of the parent model.
    parent = check(parent).for('parent').asModelType([
      'ReadOnlyRootCollectionSync',
      'ReadOnlyChildCollectionSync',
      'ReadOnlyRootObjectSync',
      'ReadOnlyChildObjectSync',
      'CommandObjectSync'
    ]);

    eventHandlers = check(eventHandlers).forOptional('eventHandlers').asType(EventHandlerList);

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

    /**
     * Transforms the business object to a plain object to send to the client.
     * <br/>_This method is usually called by the parent object._
     *
     * @function ReadOnlyChildObjectSync#toCto
     * @returns {object} The client transfer object.
     */
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
          getAuthorizationContext(AuthorizationAction.readProperty, property.name)
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

    function fetchChildren(dto) {
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

    function getDataContext () {
      if (!dataContext)
        dataContext = new DataPortalContext(
            null, properties.toArray(), getPropertyValue, setPropertyValue
        );
      return dataContext.setState(null, false);
    }

    function raiseEvent (event, methodName, error) {
      self.emit(
          DataPortalEvent.getName(event),
          new DataPortalEventArgs(event, name, null, methodName, error)
      );
    }

    function wrapError (error) {
      return new DataPortalError(MODEL_DESC, name, DataPortalAction.fetch, error);
    }

    //endregion

    //region Fetch

    function data_fetch (data, method) {
      // Check permissions.
      if (method === M_FETCH ? canDo(AuthorizationAction.fetchObject) : canExecute(method)) {
        try {
          // Launch start event.
          /**
           * The event arises before the business object instance will be retrieved from the repository.
           * @event ReadOnlyChildObjectSync#preFetch
           * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
           * @param {ReadOnlyChildObjectSync} oldObject - The instance of the model before the data portal action.
           */
          raiseEvent(DataPortalEvent.preFetch, method);
          // Execute fetch.
          var dto = null;
          if (extensions.dataFetch) {
            // *** Custom fetch.
            dto = extensions.dataFetch.call(self, getDataContext(), data, method);
          } else {
            // *** Standard fetch.
            // Child element gets data from parent.
            dto = data;
            fromDto.call(self, dto);
          }
          // Fetch children as well.
          fetchChildren(dto);
          // Launch finish event.
          /**
           * The event arises after the business object instance has been retrieved from the repository.
           * @event ReadOnlyChildObjectSync#postFetch
           * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
           * @param {ReadOnlyChildObjectSync} newObject - The instance of the model after the data portal action.
           */
          raiseEvent(DataPortalEvent.postFetch, method);
        } catch (e) {
          // Wrap the intercepted error.
          var dpError = wrapError(e);
          // Launch finish event.
          raiseEvent(DataPortalEvent.postFetch, method, dpError);
          // Rethrow the original error.
          throw e;
        }
      }
    }

    //endregion

    //endregion

    //region Actions

    /**
     * Initializes a business object with data retrieved from the repository.
     * <br/>_This method is called by the parent object._
     *
     * @function ReadOnlyChildObjectSync#fetch
     * @protected
     * @param {object} [data] - The data to load into the business object.
     * @param {string} [method] - An alternative fetch method to check for permission.
     */
    this.fetch = function(data, method) {
      data_fetch(data, method || M_FETCH);
    };

    //endregion

    //region Validation

    /**
     * Indicates whether all the validation rules of the business object, including
     * the ones of its child objects, succeeds. A valid business object may have
     * broken rules with severity of success, information and warning.
     *
     * _This method is called by the parent object._
     *
     * _By default read-only business objects are supposed to be valid._
     *
     * @function ReadOnlyChildObjectSync#isValid
     * @protected
     * @returns {boolean} True when the business object is valid, otherwise false.
     */
    this.isValid = function() {
      if (!isValidated)
        this.checkRules();

      return brokenRules.isValid() && childrenAreValid();
    };

    /**
     * Executes all the validation rules of the business object, including the ones
     * of its child objects.
     *
     * _This method is called by the parent object._
     *
     * _By default read-only business objects are supposed to be valid._
     *
     * @function ReadOnlyChildObjectSync#checkRules
     * @protected
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
     * Gets the broken rules of the business object.
     *
     * _This method is called by the parent object._
     *
     * _By default read-only business objects are supposed to be valid._
     *
     * @function ReadOnlyChildObjectSync#getBrokenRules
     * @protected
     * @param {string} [namespace] - The namespace of the message keys when messages are localizable.
     * @returns {bo.rules.BrokenRulesOutput} The broken rules of the business object.
     */
    this.getBrokenRules = function(namespace) {
      var bro = brokenRules.output(namespace);
      bro = getChildBrokenRules(namespace, bro);
      return bro.$length ? bro : null;
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

    function getPropertyContext(primaryProperty) {
      if (!propertyContext)
        propertyContext = new PropertyContext(
            name, properties.toArray(), readPropertyValue);
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
            throw new ModelError('readOnly', name, property.name);
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
            throw new ModelError('readOnly', name, property.name);
          },
          enumerable: false
        });
      }
    });

    //endregion

    // Immutable object.
    Object.freeze(this);
  };
  util.inherits(ReadOnlyChildObjectSync, ModelBase);

  /**
   * The name of the model type.
   *
   * @property {string} ReadOnlyChildObjectSync.constructor.modelType
   * @default ReadOnlyChildObjectSync
   * @readonly
   */

  Object.defineProperty(ReadOnlyChildObjectSync, 'modelType', {
    get: function () { return CLASS_NAME; }
  });
  /**
   * The name of the model. However, it can be hidden by a model property with the same name.
   *
   * @name ReadOnlyChildObjectSync#$modelName
   * @type {string}
   * @readonly
   */
  ReadOnlyChildObjectSync.prototype.$modelName = name;

  //region Factory methods

  /**
   * Creates a new read-only business object instance.
   * <br/>_This method is called by the parent object._
   *
   * @function ReadOnlyChildObjectSync.create
   * @protected
   * @param {object} parent - The parent business object.
   * @param {bo.shared.EventHandlerList} [eventHandlers] - The event handlers of the instance.
   * @returns {ReadOnlyChildObjectSync} A new read-only business object.
   */
  ReadOnlyChildObjectSync.create = function(parent, eventHandlers) {
    var instance = new ReadOnlyChildObjectSync(parent, eventHandlers);
    return instance;
  };

  /**
   * Initializes a read-only business object width data retrieved from the repository.
   * <br/>_This method is called by the parent object._
   *
   * @function ReadOnlyChildObjectSync.load
   * @protected
   * @param {object} parent - The parent business object.
   * @param {object} data - The data to load into the business object.
   * @param {bo.shared.EventHandlerList} [eventHandlers] - The event handlers of the instance.
   * @returns {ReadOnlyChildObjectSync} The required read-only business object.
   *
   * @throws {@link bo.rules.AuthorizationError Authorization error}:
   *      The user has no permission to execute the action.
   */
  ReadOnlyChildObjectSync.load = function(parent, data, eventHandlers) {
    var instance = new ReadOnlyChildObjectSync(parent, eventHandlers);
    instance.fetch(data);
    return instance;
  };

  //endregion

  return ReadOnlyChildObjectSync;
};

module.exports = ReadOnlyChildObjectSyncFactory;
