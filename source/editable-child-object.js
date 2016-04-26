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

var DataPortalAction = require('./shared/data-portal-action.js');
var DataPortalContext = require('./shared/data-portal-context.js');
var DataPortalEvent = require('./shared/data-portal-event.js');
var DataPortalEventArgs = require('./shared/data-portal-event-args.js');
var DataPortalError = require('./shared/data-portal-error.js');

var MODEL_STATE = require('./shared/model-state.js');
var CLASS_NAME = 'EditableChildObject';
var MODEL_DESC = 'Editable child object';
var M_FETCH = DataPortalAction.getName(DataPortalAction.fetch);

//endregion

/**
 * Factory method to create definitions of asynchronous editable child objects.
 *
 *    Valid child model types are:
 *
 *      * ReadOnlyChildCollection
 *      * ReadOnlyChildObject
 *
 * @function bo.EditableChildObject
 * @param {string} name - The name of the model.
 * @param {bo.shared.PropertyManager} properties - The property definitions.
 * @param {bo.shared.RuleManager} rules - The validation and authorization rules.
 * @param {bo.shared.ExtensionManager} extensions - The customization of the model.
 * @returns {EditableChildObject} The constructor of an asynchronous editable child object.
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The model name must be a non-empty string.
 * @throws {@link bo.system.ArgumentError Argument error}: The properties must be a PropertyManager object.
 * @throws {@link bo.system.ArgumentError Argument error}: The rules must be a RuleManager object.
 * @throws {@link bo.system.ArgumentError Argument error}: The extensions must be a ExtensionManager object.
 *
 * @throws {@link bo.shared.ModelError Model error}:
 *    The child objects must be EditableChildCollection or EditableChildObject instances.
 */
var EditableChildObjectFactory = function (name, properties, rules, extensions) {
  var check = Argument.inConstructor(CLASS_NAME);

  name = check(name).forMandatory('name').asString();
  properties = check(properties).forMandatory('properties').asType(PropertyManager);
  rules = check(rules).forMandatory('rules').asType(RuleManager);
  extensions = check(extensions).forMandatory('extensions').asType(ExtensionManager);

  // Verify the model types of child objects.
  properties.modelName = name;
  properties.verifyChildTypes([ 'EditableChildCollection', 'EditableChildObject' ]);

  // Get data access object.
  var dao = extensions.getDataAccessObject(name);

  /**
   * @classdesc
   *    Represents the definition of an asynchronous editable child object.
   * @description
   *    Creates a new asynchronous editable child object instance.
   *
   *    _The name of the model type available as:
   *    __&lt;instance&gt;.constructor.modelType__, returns 'EditableChildObject'._
   *
   *    Valid parent model types are:
   *
   *      * EditableChildCollection
   *      * EditableRootObject
   *      * EditableChildObject
   *
   * @name EditableChildObject
   * @constructor
   * @param {object} parent - The parent business object.
   * @param {bo.shared.EventHandlerList} [eventHandlers] - The event handlers of the instance.
   *
   * @extends ModelBase
   *
   * @throws {@link bo.system.ArgumentError Argument error}:
   *    The parent object must be an EditableChildCollection, EditableRootObject or
   *    EditableChildObject instance.
   * @throws {@link bo.system.ArgumentError Argument error}:
   *    The event handlers must be an EventHandlerList object or null.
   *
   * @fires EditableChildObject#preCreate
   * @fires EditableChildObject#postCreate
   * @fires EditableChildObject#preFetch
   * @fires EditableChildObject#postFetch
   * @fires EditableChildObject#preInsert
   * @fires EditableChildObject#postInsert
   * @fires EditableChildObject#preUpdate
   * @fires EditableChildObject#postUpdate
   * @fires EditableChildObject#preRemove
   * @fires EditableChildObject#postRemove
   */
  var EditableChildObject = function (parent, eventHandlers) {
    ModelBase.call(this);
    var check = Argument.inConstructor(name);

    // Verify the model type of the parent model.
    parent = check(parent).for('parent').asModelType([
      'EditableRootCollection',
      'EditableChildCollection',
      'EditableRootObject',
      'EditableChildObject'
    ]);

    eventHandlers = check(eventHandlers).forOptional('eventHandlers').asType(EventHandlerList);

    var self = this;
    var state = null;
    var isDirty = false;
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

    //region Mark object state

    /*
     * From:         To:  | pri | cre | cha | mfr | rem
     * -------------------------------------------------
     * NULL               |  +  |  +  |  N  |  N  |  N
     * -------------------------------------------------
     * pristine           |  o  |  -  |  +  |  +  |  -
     * -------------------------------------------------
     * created            |  +  |  o  |  o  | (-) |  +
     * -------------------------------------------------
     * changed            |  +  |  -  |  o  |  +  |  -
     * -------------------------------------------------
     * markedForRemoval   |  -  |  -  |  o  |  o  |  +
     * -------------------------------------------------
     * removed            |  -  |  -  |  -  |  -  |  o
     * -------------------------------------------------
     *
     * Explanation:
     *   +  :  possible transition
     *   -  :  not allowed transition, throws exception
     *   o  :  no change, no action
     *   N  :  impossible start up, throws exception
     */

    function markAsPristine() {
      if (state === MODEL_STATE.markedForRemoval || state === MODEL_STATE.removed)
        illegal(MODEL_STATE.pristine);
      else if (state !== MODEL_STATE.pristine) {
        state = MODEL_STATE.pristine;
        isDirty = false;
      }
    }

    function markAsCreated() {
      if (state === null) {
        state = MODEL_STATE.created;
        isDirty = true;
        propagateChange(); // up to the parent
      }
      else if (state !== MODEL_STATE.created)
        illegal(MODEL_STATE.created);
    }

    function markAsChanged(itself) {
      if (state === MODEL_STATE.pristine) {
        state = MODEL_STATE.changed;
        isDirty = isDirty || itself;
        propagateChange(); // up to the parent
        isValidated = false;
      }
      else if (state === MODEL_STATE.created) {
        isDirty = isDirty || itself;
        propagateChange(); // up to the parent
        isValidated = false;
      }
      else if (state === MODEL_STATE.removed)
        illegal(MODEL_STATE.changed);
    }

    function markForRemoval() {
      if (state === MODEL_STATE.pristine || state === MODEL_STATE.changed) {
        state = MODEL_STATE.markedForRemoval;
        isDirty = true;
        propagateRemoval(); // down to children
        propagateChange(); // up to the parent
      }
      else if (state === MODEL_STATE.created)
        state = MODEL_STATE.removed;
      else if (state !== MODEL_STATE.markedForRemoval)
        illegal(MODEL_STATE.markedForRemoval);
    }

    function markAsRemoved() {
      if (state === MODEL_STATE.created || state === MODEL_STATE.markedForRemoval) {
        state = MODEL_STATE.removed;
        isDirty = false;
      }
      else if (state !== MODEL_STATE.removed)
        illegal(MODEL_STATE.removed);
    }

    function illegal(newState) {
      throw new ModelError('transition',
        (state == null ? 'NULL' : MODEL_STATE.getName(state)),
        MODEL_STATE.getName(newState));
    }

    function propagateChange() {
      parent.childHasChanged();
    }

    /**
     * Notes that a child object has changed.
     * <br/>_This method is called by child objects._
     *
     * @function EditableChildObject#childHasChanged
     * @protected
     */
    this.childHasChanged = function() {
      markAsChanged(false);
    };

    function propagateRemoval() {
      properties.children().forEach(function(property) {
        var child = getPropertyValue(property);
        child.remove();
      });
    }

    //endregion

    //region Show object state

    /**
     * Gets the state of the model. Valid states are:
     * pristine, created, changed, markedForRemoval and removed.
     *
     * @function EditableChildObject#getModelState
     * @returns {string} The state of the model.
     */
    this.getModelState = function () {
      return MODEL_STATE.getName(state);
    };

    /**
     * Indicates whether the business object has been created newly and
     * not has been yet saved, i.e. its state is created.
     *
     * @function EditableChildObject#isNew
     * @returns {boolean} True when the business object is new, otherwise false.
     */
    this.isNew = function () {
      return state === MODEL_STATE.created;
    };

    /**
     * Indicates whether the business object itself or any of its child objects differs the one
     * that is stored in the repository, i.e. its state is created, changed or markedForRemoval.
     *
     * @function EditableChildObject#isDirty
     * @returns {boolean} True when the business object has been changed, otherwise false.
     */
    this.isDirty = function () {
      return state === MODEL_STATE.created ||
             state === MODEL_STATE.changed ||
             state === MODEL_STATE.markedForRemoval;
    };

    /**
     * Indicates whether the business object itself, ignoring its child objects, differs the one
     * that is stored in the repository.
     *
     * @function EditableChildObject#isSelfDirty
     * @returns {boolean} True when the business object itself has been changed, otherwise false.
     */
    this.isSelfDirty = function () {
      return isDirty;
    };

    /**
     * Indicates whether the business object will be deleted from the repository,
     * i.e. its state is markedForRemoval.
     *
     * @function EditableChildObject#isDeleted
     * @returns {boolean} True when the business object will be deleted, otherwise false.
     */
    this.isDeleted = function () {
      return state === MODEL_STATE.markedForRemoval;
    };

    //endregion

    //region Transfer object methods

    function getTransferContext (authorize) {
      return authorize ?
          new TransferContext(properties.toArray(), readPropertyValue, writePropertyValue) :
          new TransferContext(properties.toArray(), getPropertyValue, setPropertyValue);
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
        return extensions.toDto.call(self, getTransferContext(false));
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
     * @function EditableChildObject#toCto
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

    function baseFromCto(cto) {
      if (cto && typeof cto === 'object') {
        properties.filter(function (property) {
          return property.isOnCto;
        }).forEach(function (property) {
          if (cto.hasOwnProperty(property.name) && typeof cto[property.name] !== 'function') {
            writePropertyValue(property, cto[property.name]);
          }
        });
      }
    }

    /**
     * Rebuilds the business object from a plain object sent by the client.
     * <br/>_This method is usually called by the parent object._
     *
     * @function EditableChildObject#fromCto
     * @param {object} cto - The client transfer object.
     * @param {external.cbFromCto} callback - Returns the eventual error.
     */
    this.fromCto = function (cto, callback) {
      if (extensions.fromCto)
        extensions.fromCto.call(self, getTransferContext(true), cto);
      else
        baseFromCto(cto);

      // Build children.
      var count = properties.childCount();
      var error = null;

      function finish (err) {
        if (err)
          error = error || err;
        if (--count == 0)
          callback(error);
      }
      if (count)
        properties.children().forEach(function (property) {
          var child = getPropertyValue(property);
          if (cto[property.name])
            child.fromCto(cto[property.name], finish);
          else
            finish(null);
        });
      else
        callback(null);
    };

    /**
     * Determines that the passed data contains current values of the model key.
     *
     * @function EditableChildObject#keyEquals
     * @protected
     * @param {object} data - Data object whose properties can contain the values of the model key.
     * @param {internal~getValue} getPropertyValue - A function that returns
     *    the current value of the given property.
     * @returns {boolean} True when the values are equal, false otherwise.
     */
    this.keyEquals = function (data) {
      return properties.keyEquals(data, getPropertyValue);
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

    function createChildren( connection ) {
      return Promise.all( properties.children().map( property => {
        var child = getPropertyValue( property );
        return child instanceof ModelBase ?
          child.create( connection ) :
          Promise.resolve( null );
      }));
    }

    function fetchChildren( dto ) {
      return Promise.all( properties.children().map( property => {
        var child = getPropertyValue( property );
        /*
         return child instanceof ModelBase ?
         child.fetch( dto[ property.name ], undefined ) :
         child.fetch( dto[ property.name ] );
         */
        return child.fetch( dto[ property.name ] );
      }));
    }

    function insertChildren( connection ) {
      return saveChildren( connection );
    }

    function updateChildren( connection ) {
      return saveChildren( connection );
    }

    function removeChildren( connection ) {
      return saveChildren( connection );
    }

    function saveChildren( connection ) {
      return Promise.all( properties.children().map( property => {
        var child = getPropertyValue( property );
        return child.save( connection );
      }));
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
      return dataContext.setState(connection, isDirty);
    }

    function raiseEvent (event, methodName, error) {
      self.emit(
          DataPortalEvent.getName(event),
          new DataPortalEventArgs(event, name, null, methodName, error)
      );
    }

    function wrapError (action, error) {
      return new DataPortalError(MODEL_DESC, name, action, error);
    }

    function runStatements (main, action, callback) {
      // Open connection.
      config.connectionManager.openConnection(
          extensions.dataSource, function (errOpen, connection) {
            if (errOpen)
              callback(wrapError(action, errOpen));
            else
              main(connection, function (err, result) {
                // Close connection.
                config.connectionManager.closeConnection(
                    extensions.dataSource, connection, function (errClose, connClosed) {
                      connection = connClosed;
                      if (err)
                        callback(wrapError(action, err));
                      else if (errClose)
                        callback(wrapError(action, errClose));
                      else
                        callback(null, result);
                    });
              });
          });
    }

    //endregion

    //region Create

    function xdata_create () {
      return new Promise( (fulfill, reject) => {
        // Does it have initializing method?
        if (extensions.dataCreate || dao.$hasCreate()) {
          var connection = null;
          // Open connection.
          config.connectionManager.openConnection( extensions.dataSource )
            .then( dsc => {
              connection = dsc;
              // Launch start event.
              /**
               * The event arises before the business object instance will be initialized in the repository.
               * @event EditableChildObject#preCreate
               * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
               * @param {EditableChildObject} oldObject - The instance of the model before the data portal action.
               */
              raiseEvent( DataPortalEvent.preCreate );
              // Execute creation.
              return extensions.dataCreate ?
                // *** Custom creation.
                extensions.dataCreate.call( self, getDataContext(connection) ) :
                // *** Standard creation.
                dao.$runMethod('create', connection)
                  .then( dto => {
                    fromDto.call( self, dto );
                  })
            })
            .then( none => {
              markAsCreated();
              // Launch finish event.
              /**
               * The event arises after the business object instance has been initialized in the repository.
               * @event EditableChildObject#postCreate
               * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
               * @param {EditableChildObject} newObject - The instance of the model after the data portal action.
               */
              raiseEvent( DataPortalEvent.postCreate );
              // Close connection.
              config.connectionManager.closeConnection( extensions.dataSource, connection )
                .then( none => {
                  fulfill( self );
                })
            })
            .catch( reason => {
              // Wrap the intercepted error.
              var dpe = wrapError(DataPortalAction.create, reason);
              // Launch finish event.
              if (connection)
                raiseEvent(DataPortalEvent.postCreate, null, dpe);
              // Close connection.
              return config.connectionManager.closeConnection( extensions.dataSource, connection )
                .then( none => {
                  reject( dpe );
                })
            })
        } else
          // Nothing to do.
          fulfill( self );
      });
    }
    function data_create ( connection ) {
      return new Promise( (fulfill, reject) => {
        // Does it have initializing method?
        if (extensions.dataCreate || dao.$hasCreate()) {
          (connection ?
              Promise.resolve( connection ) :
              // Open connection.
              config.connectionManager.openConnection( extensions.dataSource )
                .then( dsc => {
                  connection = dsc;
                }))
            .then( none => {
              // Launch start event.
              /**
               * The event arises before the business object instance will be initialized in the repository.
               * @event EditableChildObject#preCreate
               * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
               * @param {EditableChildObject} oldObject - The instance of the model before the data portal action.
               */
              raiseEvent( DataPortalEvent.preCreate );
              // Execute creation.
              return extensions.dataCreate ?
                // *** Custom creation.
                extensions.dataCreate.call( self, getDataContext(connection) ) :
                // *** Standard creation.
                dao.$runMethod('create', connection)
                  .then( dto => {
                    fromDto.call( self, dto );
                  })
            })
            .then( none => {
              // Create children as well.
              return createChildren( connection );
            })
            .then( none => {
              markAsCreated();
              // Launch finish event.
              /**
               * The event arises after the business object instance has been initialized in the repository.
               * @event EditableChildObject#postCreate
               * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
               * @param {EditableChildObject} newObject - The instance of the model after the data portal action.
               */
              raiseEvent( DataPortalEvent.postCreate );
              // Close connection.
              config.connectionManager.closeConnection( extensions.dataSource, connection )
                .then( none => {
                  fulfill( self );
                })
            })
            .catch( reason => {
              // Wrap the intercepted error.
              var dpe = wrapError(DataPortalAction.create, reason);
              // Launch finish event.
              if (connection)
                raiseEvent(DataPortalEvent.postCreate, null, dpe);
              // Close connection.
              return config.connectionManager.closeConnection( extensions.dataSource, connection )
                .then( none => {
                  reject( dpe );
                })
            })
        } else
        // Nothing to do.
          fulfill( self );
      });
    }

    //endregion

    //region Fetch

    function data_fetch ( data, method ) {
      return new Promise( (fulfill, reject) => {
        // Check permissions.
        if (method === M_FETCH ? canDo( AuthorizationAction.fetchObject ) : canExecute( method )) {
          // Launch start event.
          /**
           * The event arises before the business object instance will be retrieved from the repository.
           * @event EditableChildObject#preFetch
           * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
           * @param {EditableChildObject} oldObject - The instance of the model before the data portal action.
           */
          raiseEvent( DataPortalEvent.preFetch, method );
          // Execute fetch.
          (extensions.dataFetch ?
              // *** Custom fetch.
              extensions.dataFetch.call( self, getDataContext( null ), data, method ) :
              // *** Standard fetch.
              new Promise( (f, r) => {
                fromDto.call( self, data );
                f( data );
            }))
            .then( none => {
              // Fetch children as well.
              return fetchChildren( data );
            })
            .then( none => {
              markAsPristine();
              // Launch finish event.
              /**
               * The event arises after the business object instance has been retrieved from the repository.
               * @event EditableChildObject#postFetch
               * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
               * @param {EditableChildObject} newObject - The instance of the model after the data portal action.
               */
              raiseEvent( DataPortalEvent.postFetch, method );
              // Nothing to return.
              fulfill( null );
            })
            .catch( reason => {
              // Wrap the intercepted error.
              var dpe = wrapError( DataPortalAction.fetch, reason );
              // Launch finish event.
              raiseEvent( DataPortalEvent.postFetch, method, dpe );
              // Pass the error.
              reject( dpe );
            });
        }
      });
    }

    //endregion

    //region Insert

    function data_insert ( connection ) {
      return new Promise( (fulfill, reject) => {
        // Check permissions.
        if (canDo( AuthorizationAction.createObject )) {
          // Launch start event.
          /**
           * The event arises before the business object instance will be created in the repository.
           * @event EditableChildObject#preInsert
           * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
           * @param {EditableChildObject} oldObject - The instance of the model before the data portal action.
           */
          raiseEvent( DataPortalEvent.preInsert );
          // Copy the values of parent keys.
          var references = properties.filter( property => {
            return property.isParentKey;
          });
          for (var i = 0; i < references.length; i++) {
            var referenceProperty = references[i];
            var parentValue = parent[ referenceProperty.name ];
            if (parentValue !== undefined)
              setPropertyValue( referenceProperty, parentValue );
          }
          // Execute insert.
          (extensions.dataInsert ?
              // *** Custom insert.
              extensions.dataInsert.call( self, getDataContext( connection )) :
              // *** Standard insert.
              dao.$runMethod( 'insert', connection, toDto.call( self ))
                .then( dto => {
                  fromDto.call( self, dto );
                }))
            .then( none => {
              // Insert children as well.
              return insertChildren( connection );
            })
            .then( none => {
              markAsPristine();
              // Launch finish event.
              /**
               * The event arises after the business object instance has been created in the repository.
               * @event EditableChildObject#postInsert
               * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
               * @param {EditableChildObject} newObject - The instance of the model after the data portal action.
               */
              raiseEvent( DataPortalEvent.postInsert );
              // Return the result.
              fulfill( self );
            })
            .catch( reason => {
              // Wrap the intercepted error.
              var dpe = wrapError( DataPortalAction.insert, reason );
              // Launch finish event.
              raiseEvent( DataPortalEvent.postInsert, null, dpe );
              // Pass the error.
              reject( dpe );
            })
        }
      });
    }

    //endregion

    //region Update

    function data_update( connection ) {
      return new Promise( (fulfill, reject) => {
        // Check permissions.
        if (canDo( AuthorizationAction.updateObject )) {
          // Launch start event.
          /**
           * The event arises before the business object instance will be updated in the repository.
           * @event EditableChildObject#preUpdate
           * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
           * @param {EditableChildObject} oldObject - The instance of the model before the data portal action.
           */
          raiseEvent( DataPortalEvent.preUpdate );
          // Execute update.
          (extensions.dataUpdate ?
              // *** Custom update.
              extensions.dataUpdate.call( self, getDataContext( connection )) :
              // *** Standard update.
              (isDirty ?
                dao.$runMethod( 'update', connection, /* dto = */ toDto.call( self ))
                  .then( dto => {
                    fromDto.call( self, dto );
                  }) :
                Promise.resolve( null )))
            .then( none => {
              // Update children as well.
              return updateChildren( connection );
            })
            .then( none => {
              markAsPristine();
              // Launch finish event.
              /**
               * The event arises after the business object instance has been updated in the repository.
               * @event EditableChildObjectSync#postUpdate
               * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
               * @param {EditableChildObjectSync} newObject - The instance of the model after the data portal action.
               */
              raiseEvent( DataPortalEvent.postUpdate );
              // Return the result.
              fulfill( self );
            })
            .catch( reason => {
              // Wrap the intercepted error.
              var dpe = wrapError( DataPortalAction.update, reason );
              // Launch finish event.
              raiseEvent( DataPortalEvent.postUpdate, null, dpe);
              // Pass the error.
              reject( dpe );
            });
        }
      });
    }

    //endregion

    //region Remove

    function data_remove( connection ) {
      return new Promise( (fulfill, reject) => {
        // Check permissions.
        if (canDo( AuthorizationAction.removeObject )) {
          // Launch start event.
          /**
           * The event arises before the business object instance will be removed from the repository.
           * @event EditableChildObject#preRemove
           * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
           * @param {EditableChildObject} oldObject - The instance of the model before the data portal action.
           */
          raiseEvent( DataPortalEvent.preRemove );
          // Remove children first.
          removeChildren( connection )
            .then( none => {
              // Execute delete.
              return extensions.dataRemove ?
                // *** Custom removal.
                extensions.dataRemove.call( self, getDataContext (connection )) :
                // *** Standard removal.
                dao.$runMethod( 'remove', connection, /* filter = */ properties.getKey( getPropertyValue ));
            })
            .then( none => {
              markAsRemoved();
              // Launch finish event.
              /**
               * The event arises after the business object instance has been removed from the repository.
               * @event EditableChildObject#postRemove
               * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
               * @param {EditableChildObject} newObject - The instance of the model after the data portal action.
               */
              raiseEvent( DataPortalEvent.postRemove );
              // Nothing to return.
              fulfill( null );
            })
            .catch( reason => {
              // Wrap the intercepted error.
              var dpe = wrapError( DataPortalAction.remove, reason );
              // Launch finish event.
              raiseEvent( DataPortalEvent.postRemove, null, dpe );
              // Pass the error.
              reject( dpe );
            });
        }
      });
    }

    //endregion

    //endregion

    //region Actions

    /**
     * Initializes a newly created business object.
     * <br/>_This method is called by the parent object._
     *
     * @function EditableChildObject#create
     * @protected
     * @param {object} connection - The connection data.
     * @returns {promise<EditableChildObject>} Returns a promise to a new editable business object.
     */
    this.create = function( connection ) {
      return data_create( connection );
    };

    /**
     * Initializes a business object with data retrieved from the repository.
     * <br/>_This method is called by the parent object._
     *
     * @function EditableChildObject#fetch
     * @protected
     * @param {object} [data] - The data to load into the business object.
     * @param {string} [method] - An alternative fetch method to check for permission.
     * @returns {promise<EditableChildObject>} Returns a promise to the end of load.
     */
    this.fetch = function( data, method ) {
      return data_fetch( data, method || M_FETCH );
    };

    /**
     * Saves the changes of the business object to the repository.
     * <br/>_This method is called by the parent object._
     *
     * @function EditableChildObject#save
     * @protected
     * @param {object} connection - The connection data.
     * @param {external.cbDataPortal} callback - The business object with the new state after the save.
     */
    this.save = function( connection ) {
      return new Promise( (fulfill, reject) => {
        if (self.isValid()) {
          switch (state) {
            case MODEL_STATE.created:
              data_insert()
                .then( inserted => {
                  fulfill( inserted );
                });
              break;
            case MODEL_STATE.changed:
              data_update()
                .then( updated => {
                  fulfill( updated );
                });
              break;
            case MODEL_STATE.markedForRemoval:
              data_remove()
                .then( removed => {
                  fulfill( removed );
                });
              break;
            default:
              fulfill( self );
          }
        }
      });
    };

    /**
     * Marks the business object to be deleted from the repository on next save.
     *
     * @function EditableChildObject#remove
     */
    this.remove = function() {
      markForRemoval();
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
     * @function EditableChildObject#isValid
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
     * @function EditableChildObject#checkRules
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
     * @function EditableChildObject#getBrokenRules
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

    var wait = 0;
    this.onReady = function() {};

    function freeze() {
      if (wait === 0) {
        var onReady = self.onReady;
        delete self.onReady;
        Object.freeze( self );
        onReady( self );
      }
    }

    function getPropertyValue( property ) {
      return store.getValue( property );
    }

    function setPropertyValue( property, value ) {
      if (store.setValue( property, value ))
        markAsChanged( true );
    }

    function readPropertyValue( property ) {
      if (canBeRead( property ))
        return property.getter ?
               property.getter( getPropertyContext( property )) :
               store.getValue( property );
      else
        return null;
    }

    function writePropertyValue( property, value ) {
      if (canBeWritten( property )) {
        var changed = property.setter ?
            property.setter( getPropertyContext( property ), value ) :
            store.setValue( property, value );
        if (changed === true)
          markAsChanged( true );
      }
    }

    function getPropertyContext( primaryProperty ) {
      if (!propertyContext)
        propertyContext = new PropertyContext(
          name, properties.toArray(), readPropertyValue, writePropertyValue );
      return propertyContext.with( primaryProperty );
    }

    properties.map( property => {

      if (property.type instanceof DataType) {

        // Initialize normal property.
        store.initValue( property );

        // Create normal property.
        Object.defineProperty( self, property.name, {
          get: () => {
            return readPropertyValue( property );
          },
          set: value => {
            if (property.isReadOnly)
              throw new ModelError( 'readOnly', name, property.name );
            writePropertyValue( property, value );
          },
          enumerable: true
        });

        // Add data type rule to normal property.
        rules.add( new DataTypeRule( property ));
      }
      else
      {
        // Determine child element type.
        if (property.type.create) {
          store.initValue( property, new property.type( self, eventHandlers ));

          //wait++;
          //// Create child object.
          //property.type.create( self, eventHandlers )
          //  .then( item => {
          //
          //    // Initialize child object property.
          //    store.initValue( property, item );
          //    wait--;
          //    freeze();
          //  });
        }
        else
        // Create child collection and initialize property.
          store.initValue( property, new property.type( self, eventHandlers ));

        // Create child element property.
        Object.defineProperty( self, property.name, {
          get: () => {
            return readPropertyValue( property );
          },
          set: value => {
            throw new ModelError( 'readOnly', name , property.name );
          },
          enumerable: false
        });
      }
    });

    //endregion

    // Immutable object.
    //freeze();
    Object.freeze( self );
  };
  util.inherits(EditableChildObject, ModelBase);

  /**
   * The name of the model type.
   *
   * @property {string} EditableChildObject.constructor.modelType
   * @default EditableChildObject
   * @readonly
   */
  Object.defineProperty(EditableChildObject, 'modelType', {
    get: function () { return CLASS_NAME; }
  });

  /**
   * The name of the model. However, it can be hidden by a model property with the same name.
   *
   * @name EditableChildObject#$modelName
   * @type {string}
   * @readonly
   */
  EditableChildObject.prototype.$modelName = name;

  //region Factory methods

  function instantiate( parent, eventHandlers ) {
    return new Promise( (fulfill, reject) => {
      var instance = new EditableChildObject( parent, eventHandlers );
      //if (instance.onReady)
      //  instance.onReady = fulfill;
      //else
        fulfill( instance );
    });
  }

  /**
   * Creates a new editable business object instance.
   * <br/>_This method is called by the parent object._
   *
   * @function EditableChildObject.create
   * @protected
   * @param {object} parent - The parent business object.
   * @param {bo.shared.EventHandlerList} [eventHandlers] - The event handlers of the instance.
   * @returns {promise<EditableChildObject>} Returns a promise to a new editable business object.
   *
   * @throws {@link bo.rules.AuthorizationError Authorization error}:
   *      The user has no permission to execute the action.
   * @throws {@link bo.shared.DataPortalError Data portal error}:
   *      Creating the business object has failed.
   */
  EditableChildObject.create = function( parent, eventHandlers ) {
    return instantiate( parent, eventHandlers )
      .then( instance => {
        return instance.create();
      });
  };

  /**
   * Initializes an editable business object width data retrieved from the repository.
   * <br/>_This method is called by the parent object._
   *
   * @function EditableChildObject.load
   * @protected
   * @param {object} parent - The parent business object.
   * @param {object} data - The data to load into the business object.
   * @param {bo.shared.EventHandlerList} [eventHandlers] - The event handlers of the instance.
   * @returns {promise<EditableChildObject>} Returns a promise to
   *      the required editable business object.
   *
   * @throws {@link bo.rules.AuthorizationError Authorization error}:
   *      The user has no permission to execute the action.
   */
  EditableChildObject.load = function( parent, data, eventHandlers ) {
    return instantiate( parent, eventHandlers )
    .then( instance => {
      return instance.fetch( data, undefined )
        .then( none => {
          return instance;
        });
    })
  };

  //endregion

  return EditableChildObject;
};

module.exports = EditableChildObjectFactory;
