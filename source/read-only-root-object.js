'use strict';

//region Imports

const config = require( './system/configuration-reader.js' );
const Argument = require( './system/argument-check.js' );

const ModelBase = require( './common/model-base.js' );
const ModelType = require( './common/model-type.js' );
const ModelError = require( './common/model-error.js' );
const ExtensionManager = require( './common/extension-manager.js' );
const EventHandlerList = require( './common/event-handler-list.js' );
const DataStore = require( './common/data-store.js' );
const DataType = require( './data-types/data-type.js' );

const PropertyManager = require( './common/property-manager.js' );
const PropertyContext = require( './common/property-context.js' );
const ValidationContext = require( './rules/validation-context.js' );
const ClientTransferContext = require( './common/client-transfer-context.js' );
const DataTransferContext = require( './common/data-transfer-context.js' );

const RuleManager = require( './rules/rule-manager.js' );
const DataTypeRule = require( './rules/data-type-rule.js' );
const BrokenRuleList = require( './rules/broken-rule-list.js' );
const AuthorizationAction = require( './rules/authorization-action.js' );
const AuthorizationContext = require( './rules/authorization-context.js' );

const DataPortalAction = require( './common/data-portal-action.js' );
const DataPortalContext = require( './common/data-portal-context.js' );
const DataPortalEvent = require( './common/data-portal-event.js' );
const DataPortalEventArgs = require( './common/data-portal-event-args.js' );
const DataPortalError = require( './common/data-portal-error.js' );

//endregion

//region Private variables

const MODEL_DESC = 'Read-only root object';
const M_FETCH = DataPortalAction.getName( DataPortalAction.fetch );

const _properties = new WeakMap();
const _rules = new WeakMap();
const _extensions = new WeakMap();
const _eventHandlers = new WeakMap();
const _store = new WeakMap();
const _brokenRules = new WeakMap();
const _isValidated = new WeakMap();
const _propertyContext = new WeakMap();
const _dataContext = new WeakMap();
const _dao = new WeakMap();

//endregion

//region Helper methods

//region Transfer object methods

function getTransferContext( authorize ) {
  const properties = _properties.get( this );

  return authorize ?
    new ClientTransferContext( properties.toArray(), readPropertyValue.bind( this ), null ) :
    new DataTransferContext( properties.toArray(), null, setPropertyValue.bind( this ) );
}

function baseFromDto( dto ) {
  const self = this;
  const properties = _properties.get( this );

  properties
    .filter( property => {
      return property.isOnDto;
    } )
    .forEach( property => {
      if (dto.hasOwnProperty( property.name ) && typeof dto[ property.name ] !== 'function') {
        setPropertyValue.call( self, property, dto[ property.name ] );
      }
    } );
}

function fromDto( dto ) {
  const extensions = _extensions.get( this );

  if (extensions.fromDto)
    extensions.fromDto.call( this, getTransferContext.call( this, false ), dto );
  else
    baseFromDto.call( this, dto );
}

function baseToCto() {
  const cto = {};
  const self = this;
  const properties = _properties.get( this );

  properties
    .filter( property => {
      return property.isOnCto;
    } )
    .forEach( property => {
      cto[ property.name ] = readPropertyValue.call( self, property );
    } );
  return cto;
}

//endregion

//region Permissions

function getAuthorizationContext( action, targetName ) {
  return new AuthorizationContext( action, targetName || '', _brokenRules.get( this ) );
}

function canBeRead( property ) {
  const rules = _rules.get( this );
  return rules.hasPermission(
    getAuthorizationContext.call( this, AuthorizationAction.readProperty, property.name )
  );
}

function canDo( action ) {
  const rules = _rules.get( this );
  return rules.hasPermission(
    getAuthorizationContext.call( this, action )
  );
}

function canExecute( methodName ) {
  const rules = _rules.get( this );
  return rules.hasPermission(
    getAuthorizationContext.call( this, AuthorizationAction.executeMethod, methodName )
  );
}

//endregion

//region Child methods

function fetchChildren( dto ) {
  const self = this;
  const properties = _properties.get( this );

  return properties.childCount() ?
    Promise.all( properties.children().map( property => {
      const child = getPropertyValue.call( self, property );
      return child.fetch( dto[ property.name ] );
    } ) ) :
    Promise.resolve( null );
}

function childrenAreValid() {
  const self = this;
  const properties = _properties.get( this );

  return properties.children().every( property => {
    const child = getPropertyValue.call( self, property );
    return child.isValid();
  } );
}

function checkChildRules() {
  const self = this;
  const properties = _properties.get( this );

  properties.children().forEach( property => {
    const child = getPropertyValue.call( self, property );
    child.checkRules();
  } );
}

function getChildBrokenRules( namespace, bro ) {
  const self = this;
  const properties = _properties.get( this );

  properties.children().forEach( property => {
    const child = getPropertyValue.call( self, property );
    const childBrokenRules = child.getBrokenRules( namespace );
    if (childBrokenRules) {
      if (childBrokenRules instanceof Array)
        bro.addChildren( property.name, childBrokenRules );
      else
        bro.addChild( property.name, childBrokenRules );
    }
  } );
  return bro;
}

//endregion

//region Properties

function getPropertyValue( property ) {
  const store = _store.get( this );
  return store.getValue( property );
}

function setPropertyValue( property, value ) {
  const store = _store.get( this );
  store.setValue( property, value );
  _store.set( this, store );
}

function getPropertyContext( primaryProperty ) {
  let propertyContext = _propertyContext.get( this );
  if (!propertyContext) {
    let properties = _properties.get( this );
    propertyContext = new PropertyContext(
      this.$modelName, properties.toArray(), readPropertyValue.bind( this )
    );
    _propertyContext.set( this, propertyContext );
  }
  return propertyContext.with( primaryProperty );
}

function readPropertyValue( property ) {
  if (canBeRead.call( this, property )) {
    if (property.getter)
      return property.getter( getPropertyContext.call( this, property ) );
    else
      return getPropertyValue.call( this, property );
  } else
    return null;
}

function initialize( name, properties, rules, extensions, eventHandlers ) {

  eventHandlers = Argument.inConstructor( name )
    .check( eventHandlers ).forOptional( 'eventHandlers' ).asType( EventHandlerList );

  // Set up business rules.
  rules.initialize( config.noAccessBehavior );

  // Set up event handlers.
  if (eventHandlers)
    eventHandlers.setup( this );

  // Create properties.
  const store = new DataStore();
  properties.map( property => {

    if (property.type instanceof DataType) {
      // Initialize normal property.
      store.initValue( property );
      // Add data type check.
      rules.add( new DataTypeRule( property ) );
    }
    else
    // Create child item/collection.
      store.initValue( property, property.type.empty( this, eventHandlers ) );

    Object.defineProperty( this, property.name, {
      get: function () {
        return readPropertyValue.call( this, property );
      },
      set: function ( value ) {
        throw new ModelError( 'readOnly', name, property.name );
      },
      enumerable: true
    } );
  } );

  // Initialize instance state.
  _properties.set( this, properties );
  _rules.set( this, rules );
  _extensions.set( this, extensions );
  _eventHandlers.set( this, eventHandlers );
  _store.set( this, store );
  _brokenRules.set( this, new BrokenRuleList( name ) );
  _isValidated.set( this, false );
  _propertyContext.set( this, null );
  _dataContext.set( this, null );

  // Get data access object.
  _dao.set( this, extensions.getDataAccessObject( name ) );

  // Immutable definition object.
  Object.freeze( this );
}

//endregion

//endregion

//region Data portal methods

//region Helper

function getDataContext( connection ) {
  let dataContext = _dataContext.get( this );
  if (!dataContext) {
    const dao = _dao.get( this );
    const properties = _properties.get( this );
    dataContext = new DataPortalContext(
      dao, properties.toArray(), getPropertyValue.bind( this ), setPropertyValue.bind( this )
    );
  }
  dataContext = dataContext.setState( connection, false );
  _dataContext.set( this, dataContext );
  return dataContext;
}

function raiseEvent( event, methodName, error ) {
  this.emit(
    DataPortalEvent.getName( event ),
    new DataPortalEventArgs( event, this.$modelName, null, methodName, error )
  );
}

function wrapError( error ) {
  return new DataPortalError( MODEL_DESC, this.$modelName, DataPortalAction.fetch, error );
}

//endregion

//region Fetch

function data_fetch( filter, method ) {
  const self = this;
  return new Promise( ( fulfill, reject ) => {
    // Check permissions.
    if (method === M_FETCH ?
        canDo.call( self, AuthorizationAction.fetchObject ) :
        canExecute.call( self, method )) {

      let connection = null;
      // Open connection.
      const extensions = _extensions.get( self );
      config.connectionManager.openConnection( extensions.dataSource )
        .then( dsc => {
          connection = dsc;
          // Launch start event.
          /**
           * The event arises before the business object instance will be retrieved from the repository.
           * @event ReadOnlyRootObject#preFetch
           * @param {bo.common.DataPortalEventArgs} eventArgs - Data portal event arguments.
           * @param {ReadOnlyRootObject} oldObject - The instance of the model before the data portal action.
           */
          raiseEvent.call( self, DataPortalEvent.preFetch, method );
          // Execute fetch.
          const dao = _dao.get( self );
          // Root element fetches all data from repository.
          return extensions.dataFetch ?
            // *** Custom fetch.
            extensions.$runMethod( 'fetch', self, getDataContext.call( this, connection ), filter, method ) :
            // *** Standard fetch.
            dao.$runMethod( method, connection, filter )
              .then( dto => {
                fromDto.call( self, dto );
                return dto;
              } );
        } )
        .then( dto => {
          // Fetch children as well.
          return fetchChildren.call( self, dto );
        } )
        .then( none => {
          // Launch finish event.
          /**
           * The event arises after the business object instance has been retrieved from the repository.
           * @event ReadOnlyRootObject#postFetch
           * @param {bo.common.DataPortalEventArgs} eventArgs - Data portal event arguments.
           * @param {ReadOnlyRootObject} newObject - The instance of the model after the data portal action.
           */
          raiseEvent.call( self, DataPortalEvent.postFetch, method );
          // Close connection.
          config.connectionManager.closeConnection( extensions.dataSource, connection )
            .then( none => {
              // Return the fetched read-only root object.
              fulfill( self );
            } );
        } )
        .catch( reason => {
          // Wrap the intercepted error.
          const dpe = wrapError.call( self, reason );
          // Launch finish event.
          raiseEvent.call( self, DataPortalEvent.postFetch, method, dpe );
          // Close connection.
          config.connectionManager.closeConnection( extensions.dataSource, connection )
            .then( none => {
              // Pass the error.
              reject( dpe );
            } );
        } );
    }
  } );
}

//endregion

//endregion

/**
 * Represents the definition of an asynchronous read-only root object.
 *
 * @name ReadOnlyRootObject
 * @extends ModelBase
 *
 * @fires ReadOnlyRootObject#preFetch
 * @fires ReadOnlyRootObject#postFetch
 */
class ReadOnlyRootObject extends ModelBase {

  //region Constructor

  /**
   * Creates a new asynchronous read-only root object instance.
   *
   * _The name of the model type available as:
   * __&lt;instance&gt;.constructor.modelType__, returns 'ReadOnlyRootObject'._
   *
   * @param {bo.common.EventHandlerList} [eventHandlers] - The event handlers of the instance.
   *
   * @throws {@link bo.system.ArgumentError Argument error}:
   *    The event handlers must be an EventHandlerList object or null.
   */
  constructor( name, properties, rules, extensions, eventHandlers ) {
    super();

    /**
     * The name of the model. However, it can be hidden by a model property with the same name.
     *
     * @member {string} ReadOnlyRootObject#$modelName
     * @readonly
     */
    this.$modelName = name;

    // Initialize the instance.
    initialize.call( this, name, properties, rules, extensions, eventHandlers );
  }

  //endregion

  //region Properties

  /**
   * The name of the model type.
   *
   * @member {string} ReadOnlyRootObject.modelType
   * @default ReadOnlyRootObject
   * @readonly
   */
  static get modelType() {
    return ModelType.ReadOnlyRootObject;
  }

  //endregion

  //region Transfer object methods

  /**
   * Transforms the business object to a plain object to send to the client.
   *
   * @function ReadOnlyRootObject#toCto
   * @returns {object} The client transfer object.
   */
  toCto() {
    let cto = {};

    // Export self properties.
    const extensions = _extensions.get( this );
    if (extensions.toCto)
      cto = extensions.toCto.call( this, getTransferContext.call( this, true ) );
    else
      cto = baseToCto.call( this );

    // Export children.
    const properties = _properties.get( this );
    properties.children().forEach( property => {
      const child = getPropertyValue.call( this, property );
      cto[ property.name ] = child.toCto();
    } );

    return cto;
  }

  //endregion

  //region Actions

  /**
   * Initializes a business object to be retrieved from the repository.
   * <br/>_This method is called by a factory method with the same name._
   *
   * @function ReadOnlyRootObject#fetch
   * @protected
   * @param {*} [filter] - The filter criteria.
   * @param {string} [method] - An alternative fetch method of the data access object.
   * @returns {Promise.<ReadOnlyRootObject>} Returns a promise to the retrieved read-only root object.
   *
   * @throws {@link bo.system.ArgumentError Argument error}:
   *      The method must be a string or null.
   * @throws {@link bo.system.ArgumentError Argument error}:
   *      The callback must be a function.
   * @throws {@link bo.rules.AuthorizationError Authorization error}:
   *      The user has no permission to execute the action.
   * @throws {@link bo.common.DataPortalError Data portal error}:
   *      Fetching the business object has failed.
   */
  fetch( filter, method ) {
    method = Argument.inMethod( this.$modelName, 'fetch' )
      .check( method ).forOptional( 'method' ).asString();
    return data_fetch.call( this, filter, method || M_FETCH );
  }

  //endregion

  //region Validation

  /**
   * Indicates whether all the validation rules of the business object, including
   * the ones of its child objects, succeeds. A valid business object may have
   * broken rules with severity of success, information and warning.
   *
   * _By default read-only business objects are supposed to be valid._
   *
   * @function ReadOnlyRootObject#isValid
   * @returns {boolean} True when the business object is valid, otherwise false.
   */
  isValid() {
    if (!_isValidated.get( this ))
      this.checkRules();

    const brokenRules = _brokenRules.get( this );
    return brokenRules.isValid() && childrenAreValid.call( this );
  }

  /**
   * Executes all the validation rules of the business object, including the ones
   * of its child objects.
   *
   * _By default read-only business objects are supposed to be valid._
   *
   * @function ReadOnlyRootObject#checkRules
   */
  checkRules() {
    const brokenRules = _brokenRules.get( this );
    brokenRules.clear();

    const store = _store.get( this );
    const context = new ValidationContext( store, brokenRules );

    const properties = _properties.get( this );
    const rules = _rules.get( this );
    properties.forEach( property => {
      rules.validate( property, context );
    } );
    checkChildRules.call( this );

    _brokenRules.set( this, brokenRules );
    _isValidated.set( this, true );
  }

  /**
   * Gets the broken rules of the business object.
   *
   * _By default read-only business objects are supposed to be valid._
   *
   * @function ReadOnlyRootObject#getBrokenRules
   * @param {string} [namespace] - The namespace of the message keys when messages are localizable.
   * @returns {bo.rules.BrokenRulesOutput} The broken rules of the business object.
   */
  getBrokenRules( namespace ) {
    const brokenRules = _brokenRules.get( this );
    let bro = brokenRules.output( namespace );
    bro = getChildBrokenRules.call( this, namespace, bro );
    return bro.$length ? bro : null;
  }

  /**
   * Gets the response to send to the client in case of broken rules.
   *
   * _By default read-only business objects are supposed to be valid._
   *
   * @function ReadOnlyRootObject#getResponse
   * @param {string} [message] - Human-readable description of the reason of the failure.
   * @param {string} [namespace] - The namespace of the message keys when messages are localizable.
   * @returns {bo.rules.BrokenRulesResponse} The broken rules response to send to the client.
   */
  getResponse( message, namespace ) {
    const output = this.getBrokenRules( namespace );
    return output ? new config.brokenRulesResponse( output, message ) : null;
  };

  //endregion
}

/**
 * Factory method to create definitions of asynchronous read-only root objects.
 *
 * @name bo.ReadOnlyRootObject
 */
class ReadOnlyRootObjectFactory {

  //region Constructor

  /**
   * Creates a definition for a read-only root object.
   *
   *    Valid child model types are:
   *
   *      * ReadOnlyChildCollection
   *      * ReadOnlyChildObject
   *
   * @param {string} name - The name of the model.
   * @param {bo.common.PropertyManager} properties - The property definitions.
   * @param {bo.common.RuleManager} rules - The validation and authorization rules.
   * @param {bo.common.ExtensionManager} extensions - The customization of the model.
   * @returns {ReadOnlyRootObject} The constructor of an asynchronous read-only root object.
   *
   * @throws {@link bo.system.ArgumentError Argument error}: The model name must be a non-empty string.
   * @throws {@link bo.system.ArgumentError Argument error}: The properties must be a PropertyManager object.
   * @throws {@link bo.system.ArgumentError Argument error}: The rules must be a RuleManager object.
   * @throws {@link bo.system.ArgumentError Argument error}: The extensions must be a ExtensionManager object.
   *
   * @throws {@link bo.common.ModelError Model error}:
   *    The child objects must be ReadOnlyChildCollection or ReadOnlyChildObject instances.
   */
  constructor( name, properties, rules, extensions ) {
    const check = Argument.inConstructor( ModelType.ReadOnlyRootObject );

    name = check( name ).forMandatory( 'name' ).asString();
    properties = check( properties ).forMandatory( 'properties' ).asType( PropertyManager );
    rules = check( rules ).forMandatory( 'rules' ).asType( RuleManager );
    extensions = check( extensions ).forMandatory( 'extensions' ).asType( ExtensionManager );

    // Verify the model type of child objects.
    properties.modelName = name;
    properties.verifyChildTypes( [
      ModelType.ReadOnlyChildCollection,
      ModelType.ReadOnlyChildObject
    ] );

    // Create model definition.
    const Model = ReadOnlyRootObject.bind( undefined, name, properties, rules, extensions );

    //region Factory methods

    /**
     * The name of the model type.
     *
     * @member {string} ReadOnlyRootObject.constructor.modelType
     * @default ReadOnlyRootObject
     * @readonly
     */
    Model.modelType = ModelType.ReadOnlyRootObject;

    /**
     * Retrieves a read-only business object from the repository.
     *
     * @function ReadOnlyRootObject.fetch
     * @param {*} [filter] - The filter criteria.
     * @param {string} [method] - An alternative fetch method of the data access object.
     * @param {bo.common.EventHandlerList} [eventHandlers] - The event handlers of the instance.
     * @returns {Promise.<ReadOnlyRootObject>} Returns a promise to the retrieved read-only root object.
     *
     * @throws {@link bo.system.ArgumentError Argument error}:
     *      The method must be a string or null.
     * @throws {@link bo.system.ArgumentError Argument error}:
     *      The event handlers must be an EventHandlerList object or null.
     * @throws {@link bo.system.ArgumentError Argument error}:
     *      The callback must be a function.
     * @throws {@link bo.rules.AuthorizationError Authorization error}:
     *      The user has no permission to execute the action.
     * @throws {@link bo.common.DataPortalError Data portal error}:
     *      Fetching the business object has failed.
     */
    Model.fetch = function ( filter, method, eventHandlers ) {
      const instance = new Model( eventHandlers );
      return instance.fetch( filter, method );
    };

    //endregion

    // Immutable definition class.
    Object.freeze( Model );
    return Model;
  }

  //endregion
}
// Immutable factory class.
Object.freeze( ReadOnlyRootObjectFactory );

module.exports = ReadOnlyRootObjectFactory;
