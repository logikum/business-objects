'use strict';

//region Imports

var util = require('util');
var config = require('./shared/configuration-reader.js');
var EnsureArgument = require('./system/ensure-argument.js');
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
 *
 * @throws {@link bo.shared.ModelError Model error}:
 *    The child objects must be ReadOnlyChildCollection or ReadOnlyChildModel instances.
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
   * @classdesc
   *    Represents the definition of an asynchronous read-only child model.
   * @description
   *    Creates a new asynchronous read-only child model instance.
   *
   *    _The name of the model type available as:
   *    __&lt;instance&gt;.constructor.modelType__, returns 'ReadOnlyChildModel'._
   *
   * @name ReadOnlyChildModel
   * @constructor
   * @param {{}} parent - The parent business object.
   * @param {bo.shared.EventHandlerList} [eventHandlers] - The event handlers of the instance.
   *
   * @extends ModelBase
   *
   * @throws {@link bo.system.ArgumentError Argument error}:
   *    The parent object must be a ReadOnlyRootCollection, ReadOnlyChildCollection,
   *    ReadOnlyRootModel, ReadOnlyChildModel or CommandObject instance.
   * @throws {@link bo.system.ArgumentError Argument error}:
   *    The event handlers must be an EventHandlerList object or null.
   *
   * @fires ReadOnlyChildModel#preFetch
   * @fires ReadOnlyChildModel#postFetch
   */
  var ReadOnlyChildModel = function(parent, eventHandlers) {
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

    eventHandlers = EnsureArgument.isOptionalType(eventHandlers, EventHandlerList,
        'c_optType', properties.name, 'eventHandlers');

    var self = this;
    var store = new DataStore();
    var brokenRules = new BrokenRuleList(properties.name);
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
     * @function ReadOnlyChildModel#toCto
     * @returns {{}} The client transfer object.
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
          new DataPortalEventArgs(event, properties.name, null, methodName, error),
          self
      );
    }

    function wrapError (action, error) {
      return new DataPortalError(MODEL_DESC, properties.name, action, error);
    }

    //endregion

    //region Fetch

    function data_fetch (filter, method, callback) {
      // Helper function for post-fetch actions.
      function finish (dto, cb) {
        // Fetch children as well.
        fetchChildren(dto, function (err) {
          if (err)
            failed(err, cb);
          else {
            // Launch finish event.
            /**
             * The event arises after the business object instance has been retrieved from the repository.
             * @event ReadOnlyChildModel#postFetch
             * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
             * @param {ReadOnlyChildModel} newObject - The instance of the model after the data portal action.
             */
            raiseEvent(DataPortalEvent.postFetch, method);
            cb(null, self);
          }
        });
      }
      // Helper callback for failure.
      function failed (err, cb) {
        // Launch finish event.
        var dpError = wrapError(DataPortalAction.fetch, err);
        raiseEvent(DataPortalEvent.postFetch, method, dpError);
        cb(err);
      }
      // Check permissions.
      if (method === M_FETCH ? canDo(AuthorizationAction.fetchObject) : canExecute(method)) {
        // Launch start event.
        /**
         * The event arises before the business object instance will be retrieved from the repository.
         * @event ReadOnlyChildModel#preFetch
         * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
         * @param {ReadOnlyChildModel} oldObject - The instance of the model before the data portal action.
         */
        raiseEvent(DataPortalEvent.preFetch, method);
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

    //endregion

    //region Actions

    /**
     * Initializes a business object with data retrieved from the repository.
     * <br/>_This method is called by the parent object._
     *
     * @function ReadOnlyChildModel#fetch
     * @protected
     * @param {{}} [data] - The data to load into the business object.
     * @param {string} [method] - An alternative fetch method to check for permission.
     * @param {external~cbDataPortal} callback - Returns the required read-only business object.
     */
    this.fetch = function(filter, method, callback) {
      data_fetch(filter, method || M_FETCH, callback);
    };

    //endregion

    //region Validation

    /**
     * Indicates whether all the validation rules of the business object, including
     * the ones of its child objects, succeeds. A valid business object may have
     * broken rules with severity of success, information and warning.
     * <br/>_This method is usually called by the parent object._
     *
     * _By default read-only business objects are supposed to be valid._
     *
     * @function ReadOnlyChildModel#isValid
     * @returns {boolean} True when the business object is valid, otherwise false.
     */
    this.isValid = function() {
      if (!isValidated)
        this.checkRules();

      return brokenRules.isValid();
    };

    /**
     * Executes all the validation rules of the business object, including the ones
     * of its child objects.
     * <br/>_This method is usually called by the parent object._
     *
     * _By default read-only business objects are supposed to be valid._
     *
     * @function ReadOnlyChildModel#checkRules
     */
    this.checkRules = function() {
      brokenRules.clear();

      properties.forEach(function(property) {
        rules.validate(property, new ValidationContext(getPropertyValue, brokenRules));
      });
      isValidated = true;
    };

    /**
     * Gets the broken rules of the business object.
     * <br/>_This method is usually called by the parent object._
     *
     * _By default read-only business objects are supposed to be valid._
     *
     * @function ReadOnlyChildModel#getBrokenRules
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

  /**
   * The name of the model type.
   *
   * @property {string} ReadOnlyChildModel.constructor.modelType
   * @default ReadOnlyChildModel
   * @readonly
   */
  Object.defineProperty(ReadOnlyChildModel, 'modelType', {
    get: function () { return 'ReadOnlyChildModel'; }
  });
  /**
   * The name of the model. However, it can be hidden by a model property with the same name.
   *
   * @name ReadOnlyChildModel#$modelName
   * @type {string}
   * @readonly
   */
  ReadOnlyChildModel.prototype.$modelName = properties.name;

  //region Factory methods

  /**
   * Creates a new read-only business object instance.
   * <br/>_This method is called by the parent object._
   *
   * @function ReadOnlyChildModel.create
   * @protected
   * @param {{}} parent - The parent business object.
   * @param {bo.shared.EventHandlerList} [eventHandlers] - The event handlers of the instance.
   * @param {external~cbDataPortal} callback - Returns a new read-only business object.
   */
  ReadOnlyChildModel.create = function(parent, eventHandlers, callback) {
    var instance = new ReadOnlyChildModel(parent, eventHandlers);
    callback(null, instance);
  };

  /**
   * Initializes a read-only business object width data retrieved from the repository.
   * <br/>_This method is called by the parent object._
   *
   * @function ReadOnlyChildModel.load
   * @protected
   * @param {{}} parent - The parent business object.
   * @param {{}} data - The data to load into the business object.
   * @param {bo.shared.EventHandlerList} [eventHandlers] - The event handlers of the instance.
   * @param {external~cbDataPortal} callback - Returns the required read-only business object.
   *
   * @throws {@link bo.rules.AuthorizationError Authorization error}:
   *      The user has no permission to execute the action.
   */
  ReadOnlyChildModel.load = function(parent, data, eventHandlers, callback) {
    var instance = new ReadOnlyChildModel(parent, eventHandlers);
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
