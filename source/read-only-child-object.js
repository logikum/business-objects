'use strict';

//region Imports

const config = require( './system/configuration-reader.js' );
const Argument = require( './system/argument-check.js' );

const ModelBase = require( './model-base.js' );
const ModelType = require( './model-type.js' );
const ModelError = require( './shared/model-error.js' );
const ExtensionManager = require( './shared/extension-manager.js' );
const EventHandlerList = require( './shared/event-handler-list.js' );
const DataStore = require( './shared/data-store.js' );
const DataType = require( './data-types/data-type.js' );

const PropertyManager = require( './shared/property-manager.js' );
const PropertyContext = require( './shared/property-context.js' );
const ValidationContext = require( './rules/validation-context.js' );
const ClientTransferContext = require('./shared/client-transfer-context.js');
const DataTransferContext = require('./shared/data-transfer-context.js');

const RuleManager = require( './rules/rule-manager.js' );
const DataTypeRule = require( './rules/data-type-rule.js' );
const BrokenRuleList = require( './rules/broken-rule-list.js' );
const AuthorizationAction = require( './rules/authorization-action.js' );
const AuthorizationContext = require( './rules/authorization-context.js' );

const DataPortalAction = require( './shared/data-portal-action.js' );
const DataPortalContext = require( './shared/data-portal-context.js' );
const DataPortalEvent = require( './shared/data-portal-event.js' );
const DataPortalEventArgs = require( './shared/data-portal-event-args.js' );
const DataPortalError = require( './shared/data-portal-error.js' );

//endregion

//region Private variables

const MODEL_DESC = 'Read-only child object';
const M_FETCH = DataPortalAction.getName( DataPortalAction.fetch );

const _properties = new WeakMap();
const _rules = new WeakMap();
const _extensions = new WeakMap();
const _parent = new WeakMap();
const _eventHandlers = new WeakMap();
const _store = new WeakMap();
const _brokenRules = new WeakMap();
const _isValidated = new WeakMap();
const _propertyContext = new WeakMap();
const _dataContext = new WeakMap();

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
  const properties = _properties.get( this );
  properties.filter( property => {
    return property.isOnDto;
  } ).forEach( property => {
    if (dto.hasOwnProperty( property.name ) && typeof dto[ property.name ] !== 'function') {
      setPropertyValue.call( this, property, dto[ property.name ] );
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
  const properties = _properties.get( this );

  properties.filter( property => {
    return property.isOnCto;
  } ).forEach( property => {
    cto[ property.name ] = readPropertyValue.call( this, property );
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
    Promise.resolve( [] );
}

function childrenAreValid() {
  const properties = _properties.get( this );
  return properties.children().every( property => {
    const child = getPropertyValue.call( this, property );
    return child.isValid();
  } );
}

function checkChildRules() {
  const properties = _properties.get( this );
  properties.children().forEach( property => {
    const child = getPropertyValue.call( this, property );
    child.checkRules();
  } );
}

function getChildBrokenRules( namespace, bro ) {
  const properties = _properties.get( this );
  properties.children().forEach( property => {

    const child = getPropertyValue.call( this, property );
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

//endregion

//endregion

//region Data portal methods

//region Helper

function getDataContext() {
  let dataContext = _dataContext.get( this );
  if (!dataContext) {
    const properties = _properties.get( this );
    dataContext = new DataPortalContext(
      null, properties.toArray(), getPropertyValue.bind( this ), setPropertyValue.bind( this )
    );
  }
  dataContext = dataContext.setState( null, false );
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

function data_fetch( dto, method ) {
  const self = this;
  return new Promise( ( fulfill, reject ) => {
    if (method === M_FETCH ?
        canDo.call( self, AuthorizationAction.fetchObject ) :
        canExecute.call( self, method )) {

      // Launch start event.
      /**
       * The event arises before the business object instance will be retrieved from the repository.
       * @event ReadOnlyChildObject#preFetch
       * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
       * @param {ReadOnlyChildObject} oldObject - The instance of the model before the data portal action.
       */
      raiseEvent.call( self, DataPortalEvent.preFetch, method );
      // Execute fetch.
      const extensions = _extensions.get( self );
      (extensions.dataFetch ?
        // *** Custom fetch.
        extensions.$runMethod( 'fetch', self, getDataContext.call( self ), dto, method ) :
        // *** Standard fetch.
        new Promise( ( f, r ) => {
          fromDto.call( self, dto );
          f( dto );
        } ))
        .then( none => {
          // Fetch children as well.
          return fetchChildren.call( self, dto );
        } )
        .then( none => {
          // Launch finish event.
          /**
           * The event arises after the business object instance has been retrieved from the repository.
           * @event ReadOnlyChildObject#postFetch
           * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
           * @param {ReadOnlyChildObject} newObject - The instance of the model after the data portal action.
           */
          raiseEvent.call( self, DataPortalEvent.postFetch, method );
          // Return the fetched read-only child object.
          fulfill( self );
        } )
        .catch( reason => {
          // Wrap the intercepted error.
          const dpe = wrapError.call( self, reason );
          // Launch finish event.
          raiseEvent.call( self, DataPortalEvent.postFetch, method, dpe );
          // Pass the error.
          reject( dpe );
        } );
    }
  } );
}

//endregion

//endregion

/**
 * Represents the definition of a read-only child object.
 *
 * @name ReadOnlyChildObject
 * @extends ModelBase
 *
 * @fires ReadOnlyChildObject#preFetch
 * @fires ReadOnlyChildObject#postFetch
 */
class ReadOnlyChildObject extends ModelBase {

  //region Constructor

  /**
   * Creates a new read-only child object instance.
   *
   * _The name of the model type available as:
   * __&lt;instance&gt;.constructor.modelType__, returns 'ReadOnlyChildObject'._
   *
   * Valid parent model types are:
   *
   *   * ReadOnlyRootCollection
   *   * ReadOnlyChildCollection
   *   * ReadOnlyRootObject
   *   * ReadOnlyChildObject
   *   * CommandObject
   *
   * @param {object} parent - The parent business object.
   * @param {bo.shared.EventHandlerList} [eventHandlers] - The event handlers of the instance.
   *
   * @throws {@link bo.system.ArgumentError Argument error}:
   *    The parent object must be a ReadOnlyRootCollection, ReadOnlyChildCollection,
   *    ReadOnlyRootObject, ReadOnlyChildObject or CommandObject instance.
   * @throws {@link bo.system.ArgumentError Argument error}:
   *    The event handlers must be an EventHandlerList object or null.
   */
  constructor( name, properties, rules, extensions, parent, eventHandlers ) {
    super();
    const check = Argument.inConstructor( name );

    // Verify the model type of the parent model.
    parent = check( parent ).for( 'parent' ).asModelType( [
      ModelType.ReadOnlyRootCollection,
      ModelType.ReadOnlyChildCollection,
      ModelType.ReadOnlyRootObject,
      ModelType.ReadOnlyChildObject,
      ModelType.CommandObject
    ] );

    eventHandlers = check( eventHandlers ).forOptional( 'eventHandlers' ).asType( EventHandlerList );

    _properties.set( this, properties );
    // _rules.set( this, rules );
    _extensions.set( this, extensions );
    _parent.set( this, parent );
    _eventHandlers.set( this, eventHandlers );
    // _store.set( this, store );
    _propertyContext.set( this, null );
    _isValidated.set( this, false );
    _brokenRules.set( this, new BrokenRuleList( name ) );
    _dataContext.set( this, null );

    /**
     * The name of the model. However, it can be hidden by a model property with the same name.
     *
     * @member {string} ReadOnlyChildObject#$modelName
     * @readonly
     */
    this.$modelName = name;

    // Set up business rules.
    rules.initialize( config.noAccessBehavior );

    // Set up event handlers.
    if (eventHandlers)
      eventHandlers.setup( this );

    const store = new DataStore();

    //region Create properties

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

    //endregion

    _store.set( this, store );
    _rules.set( this, rules );

    // Immutable definition object.
    Object.freeze( this );
  }

  //endregion

  //region Properties

  /**
   * The name of the model type.
   *
   * @member {string} ReadOnlyChildObject.modelType
   * @default ReadOnlyChildObject
   * @readonly
   */
  static get modelType() {
    return ModelType.ReadOnlyChildObject;
  }

  //endregion

  //region Transfer object methods

  /**
   * Transforms the business object to a plain object to send to the client.
   * <br/>_This method is usually called by the parent object._
   *
   * @function ReadOnlyChildObject#toCto
   * @returns {object} The client transfer object.
   */
  toCto() {
    let cto = {};
    const extensions = _extensions.get( this );
    if (extensions.toCto)
      cto = extensions.toCto.call( this, getTransferContext.call( this, true ) );
    else
      cto = baseToCto.call( this );

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
   * Initializes a business object with data retrieved from the repository.
   * <br/>_This method is called by the parent object._
   *
   * @function ReadOnlyChildObject#fetch
   * @protected
   * @param {object} [data] - The data to load into the business object.
   * @param {string} [method] - An alternative fetch method to check for permission.
   * @returns {Promise.<ReadOnlyChildObject>} Returns a promise to the retrieved read-only child object.
   */
  fetch( data, method ) {
    return data_fetch.call( this, data, method || M_FETCH );
  }

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
   * @function ReadOnlyChildObject#isValid
   * @protected
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
   * _This method is called by the parent object._
   *
   * _By default read-only business objects are supposed to be valid._
   *
   * @function ReadOnlyChildObject#checkRules
   * @protected
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
   * _This method is called by the parent object._
   *
   * _By default read-only business objects are supposed to be valid._
   *
   * @function ReadOnlyChildObject#getBrokenRules
   * @protected
   * @param {string} [namespace] - The namespace of the message keys when messages are localizable.
   * @returns {bo.rules.BrokenRulesOutput} The broken rules of the business object.
   */
  getBrokenRules( namespace ) {
    const brokenRules = _brokenRules.get( this );
    let bro = brokenRules.output( namespace );
    bro = getChildBrokenRules.call( this, namespace, bro );
    return bro.$length ? bro : null;
  }

  //endregion
}

/**
 * Factory method to create definitions of read-only child objects.
 *
 * @name bo.ReadOnlyChildObject
 */
class ReadOnlyChildObjectFactory {

  //region Constructor

  /**
   * Creates definition for a read-only child object.
   *
   *    Valid child model types are:
   *
   *      * ReadOnlyChildCollection
   *      * ReadOnlyChildObject
   *
   * @param {string} name - The name of the model.
   * @param {bo.shared.PropertyManager} properties - The property definitions.
   * @param {bo.shared.RuleManager} rules - The validation and authorization rules.
   * @param {bo.shared.ExtensionManager} extensions - The customization of the model.
   * @returns {ReadOnlyChildObject} The constructor of an asynchronous read-only child object.
   *
   * @throws {@link bo.system.ArgumentError Argument error}: The model name must be a non-empty string.
   * @throws {@link bo.system.ArgumentError Argument error}: The properties must be a PropertyManager object.
   * @throws {@link bo.system.ArgumentError Argument error}: The rules must be a RuleManager object.
   * @throws {@link bo.system.ArgumentError Argument error}: The extensions must be a ExtensionManager object.
   *
   * @throws {@link bo.shared.ModelError Model error}:
   *    The child objects must be ReadOnlyChildCollection or ReadOnlyChildObject instances.
   */
  constructor( name, properties, rules, extensions ) {
    const check = Argument.inConstructor( ModelType.ReadOnlyChildObject );

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
    const Model = ReadOnlyChildObject.bind( undefined, name, properties, rules, extensions );

    //region Factory methods

    /**
     * The name of the model type.
     *
     * @member {string} ReadOnlyChildObject.constructor.modelType
     * @default ReadOnlyChildObject
     * @readonly
     */
    Model.modelType = ModelType.ReadOnlyChildObject;

    /**
     * Creates a new uninitialized read-only child object instance.
     * <br/>_This method is called by the parent object._
     *
     * @function ReadOnlyChildObject.empty
     * @protected
     * @param {object} parent - The parent business object.
     * @param {bo.shared.EventHandlerList} [eventHandlers] - The event handlers of the instance.
     * @returns {ReadOnlyChildObject} Returns a new read-only child object.
     */
    Model.empty = function ( parent, eventHandlers ) {
      return new Model( parent, eventHandlers );
    };

    /**
     * Initializes a read-only business object width data retrieved from the repository.
     * <br/>_This method is called by the parent object._
     *
     * @function ReadOnlyChildObject.load
     * @protected
     * @param {object} parent - The parent business object.
     * @param {object} data - The data to load into the business object.
     * @param {bo.shared.EventHandlerList} [eventHandlers] - The event handlers of the instance.
     * @returns {Promise.<ReadOnlyChildObject>} Returns a promise to the retrieved read-only child object.
     *
     * @throws {@link bo.rules.AuthorizationError Authorization error}:
     *      The user has no permission to execute the action.
     */
    Model.load = function ( parent, data, eventHandlers ) {
      const instance = new Model( parent, eventHandlers );
      return instance.fetch( data );
    };

    //endregion

    // Immutable definition class.
    Object.freeze( Model );
    return Model;
  }

  //endregion
}
// Immutable factory class.
Object.freeze( ReadOnlyChildObjectFactory );

module.exports = ReadOnlyChildObjectFactory;
