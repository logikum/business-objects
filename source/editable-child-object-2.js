'use strict';

//region Imports

const config = require( './system/configuration-reader.js' );
const Argument = require( './system/argument-check.js' );
const Enumeration = require( './system/enumeration.js' );

const ModelBase = require( './model-base-2.js' );
const ModelType = require( './model-type.js' );
const ModelError = require( './shared/model-error.js' );
const ExtensionManager = require( './shared/extension-manager.js' );
const EventHandlerList = require( './shared/event-handler-list.js' );
const DataStore = require( './shared/data-store.js' );
const DataType = require( './data-types/data-type.js' );

const PropertyInfo = require( './shared/property-info.js' );
const PropertyManager = require( './shared/property-manager.js' );
const PropertyContext = require( './shared/property-context.js' );
const ValidationContext = require( './rules/validation-context.js' );
const ClientTransferContext = require( './shared/client-transfer-context.js' );
const DataTransferContext = require( './shared/data-transfer-context.js' );

const RuleManager = require( './rules/rule-manager.js' );
const DataTypeRule = require( './rules/data-type-rule.js' );
const BrokenRuleList = require( './rules/broken-rule-list.js' );
const RuleSeverity = require( './rules/rule-severity.js' );
const AuthorizationAction = require( './rules/authorization-action.js' );
const AuthorizationContext = require( './rules/authorization-context.js' );

const DataPortalAction = require( './shared/data-portal-action.js' );
const DataPortalContext = require( './shared/data-portal-context.js' );
const DataPortalEvent = require( './shared/data-portal-event.js' );
const DataPortalEventArgs = require( './shared/data-portal-event-args.js' );
const DataPortalError = require( './shared/data-portal-error.js' );

//endregion

//region Private variables

const MODEL_STATE = require( './shared/model-state.js' );
const MODEL_DESC = 'Editable child object';
const M_FETCH = DataPortalAction.getName( DataPortalAction.fetch );

const _properties = new WeakMap();
const _rules = new WeakMap();
const _extensions = new WeakMap();
const _parent = new WeakMap();
const _eventHandlers = new WeakMap();
const _propertyContext = new WeakMap();
const _store = new WeakMap();
const _isValidated = new WeakMap();
const _brokenRules = new WeakMap();
const _dataContext = new WeakMap();

//endregion

/**
 * Represents the definition of an asynchronous editable child object.
 *
 * @name EditableChildObject
 * @extends ModelBase
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
class EditableChildObject extends ModelBase {

  //region Constructor

  /**
   * Creates a new asynchronous editable child object instance.
   *
   * _The name of the model type available as:
   * __&lt;instance&gt;.constructor.modelType__, returns 'EditableChildObject'._
   *
   * Valid parent model types are:
   *
   *   * EditableRootCollection
   *   * EditableChildCollection
   *   * EditableRootObject
   *   * EditableChildObject
   *
   * @param {object} parent - The parent business object.
   * @param {bo.shared.EventHandlerList} [eventHandlers] - The event handlers of the instance.
   *
   * @throws {@link bo.system.ArgumentError Argument error}:
   *    The parent object must be an EditableChildCollection, EditableRootObject or
   *    EditableChildObject instance.
   * @throws {@link bo.system.ArgumentError Argument error}:
   *    The event handlers must be an EventHandlerList object or null.
   */
  constructor( name, properties, rules, extensions, parent, eventHandlers ) {
    const check = Argument.inConstructor( name );

    // Verify the model type of the parent model.
    parent = check( parent ).for( 'parent' ).asModelType( [
      ModelType.EditableRootCollection,
      ModelType.EditableChildCollection,
      ModelType.EditableRootObject,
      ModelType.EditableChildObject
    ] );

    eventHandlers = check( eventHandlers ).forOptional( 'eventHandlers' ).asType( EventHandlerList );

    _properties.set( this, properties );
    // _rules.set( this, rules );
    _extensions.set( this, extensions );
    _parent.set( this, parent );
    _eventHandlers.set( this, eventHandlers );
    // _store.set( this, store );
    _propertyContext.set( this, null );
    _state.set( this, null );
    _isDirty.set( this, false );
    _isValidated.set( this, false );
    _brokenRules.set( this, new BrokenRuleList( name ) );
    _dataContext.set( this, null );

    // Get data access object.
    _dao.set( this, extensions.getDataAccessObject( name ) );

    /**
     * The name of the model. However, it can be hidden by a model property with the same name.
     *
     * @member {string} EditableChildObject#$modelName
     * @readonly
     */
    this.$modelName = name;

    // Set up business rules.
    rules.initialize( config.noAccessBehavior );

    // Set up event handlers.
    if (eventHandlers)
      eventHandlers.setup( self );

    const store = new DataStore();

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
   * @member {string} EditableChildObject.modelType
   * @default EditableChildObject
   * @readonly
   */
  static get modelType() {
    return ModelType.EditableChildObject;
  }

  //endregion
}

/**
 * Factory method to create definitions of editable child objects.
 *
 * @name bo.EditableChildObject
 */
class EditableChildObjectFactory {

  //region Constructor

  /**
   * Creates a definition for an editable child object.
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
  constructor( name, properties, rules, extensions ) {
    const check = Argument.inConstructor( ModelType.EditableChildObject );

    name = check( name ).forMandatory( 'name' ).asString();
    properties = check( properties ).forMandatory( 'properties' ).asType( PropertyManager );
    rules = check( rules ).forMandatory( 'rules' ).asType( RuleManager );
    extensions = check( extensions ).forMandatory( 'extensions' ).asType( ExtensionManager );

    // Verify the model types of child objects.
    properties.modelName = name;
    properties.verifyChildTypes( [
      ModelType.EditableChildCollection,
      ModelType.EditableChildObject
    ] );

    // Create model definition.
    const Model = EditableChildObject.bind( undefined, name, properties, rules, extensions );

    //region Factory methods

    /**
     * The name of the model type.
     *
     * @member {string} EditableChildObject.modelType
     * @default EditableChildObject
     * @readonly
     */
    Model.modelType = ModelType.EditableChildObject;

    /**
     * Creates a new editable child object instance.
     * <br/>_This method is called by the parent object._
     *
     * @function EditableChildObject.create
     * @protected
     * @param {object} parent - The parent business object.
     * @param {bo.shared.EventHandlerList} [eventHandlers] - The event handlers of the instance.
     * @returns {Promise.<EditableChildObject>} Returns a promise to the new editable child object.
     *
     * @throws {@link bo.rules.AuthorizationError Authorization error}:
     *      The user has no permission to execute the action.
     * @throws {@link bo.shared.DataPortalError Data portal error}:
     *      Creating the business object has failed.
     */
    Model.create = function ( parent, eventHandlers ) {
      const instance = new Model( parent, eventHandlers );
      return instance.create();
    };

    /**
     * Initializes an editable child object width data retrieved from the repository.
     * <br/>_This method is called by the parent object._
     *
     * @function EditableChildObject.load
     * @protected
     * @param {object} parent - The parent business object.
     * @param {object} data - The data to load into the business object.
     * @param {bo.shared.EventHandlerList} [eventHandlers] - The event handlers of the instance.
     * @returns {Promise.<EditableChildObject>} Returns a promise to the retrieved editable child object.
     *
     * @throws {@link bo.rules.AuthorizationError Authorization error}:
     *      The user has no permission to execute the action.
     */
    Model.load = function ( parent, data, eventHandlers ) {
      // const instance = new Model( parent, eventHandlers );
      return instance.fetch( data, undefined );
    };

    //endregion

    // Immutable definition class.
    Object.freeze( Model );
    return Model;
  }

  //endregion
}
// Immutable factory class.
Object.freeze( EditableChildObjectFactory );

module.exports = EditableChildObjectFactory;
