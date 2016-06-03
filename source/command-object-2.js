'use strict';

//region Imports

const util = require('util');
const config = require('./system/configuration-reader.js');
const Argument = require('./system/argument-check.js');
const Enumeration = require('./system/enumeration.js');

const ModelBase = require('./model-base-2.js');
const ModelType = require( './model-type.js' );
const ModelError = require('./shared/model-error.js');
const ExtensionManager = require('./shared/extension-manager.js');
const EventHandlerList = require('./shared/event-handler-list.js');
const DataStore = require('./shared/data-store.js');
const DataType = require('./data-types/data-type.js');

const PropertyInfo = require('./shared/property-info.js');
const PropertyManager = require('./shared/property-manager.js');
const PropertyContext = require('./shared/property-context.js');
const ValidationContext = require('./rules/validation-context.js');
const DataTransferContext = require('./shared/data-transfer-context.js');

const RuleManager = require('./rules/rule-manager.js');
const DataTypeRule = require('./rules/data-type-rule.js');
const BrokenRuleList = require('./rules/broken-rule-list.js');
const RuleSeverity = require('./rules/rule-severity.js');
const AuthorizationAction = require('./rules/authorization-action.js');
const AuthorizationContext = require('./rules/authorization-context.js');
const BrokenRulesResponse = require('./rules/broken-rules-response.js');

const DataPortalAction = require('./shared/data-portal-action.js');
const DataPortalContext = require('./shared/data-portal-context.js');
const DataPortalEvent = require('./shared/data-portal-event.js');
const DataPortalEventArgs = require('./shared/data-portal-event-args.js');
const DataPortalError = require('./shared/data-portal-error.js');

//endregion

//region Private variables

const MODEL_DESC = 'Command object';
const M_EXECUTE = DataPortalAction.getName(DataPortalAction.execute);

const _properties = new WeakMap();
const _rules = new WeakMap();
const _extensions = new WeakMap();
const _eventHandlers = new WeakMap();
const _propertyContext = new WeakMap();
const _store = new WeakMap();
const _isValidated = new WeakMap();
const _brokenRules = new WeakMap();
const _dataContext = new WeakMap();
const _dao = new WeakMap();

//endregion


/**
 * Represents the definition of an asynchronous command object model.
 *
 * @name CommandObject
 * @extends ModelBase
 *
 * @fires CommandObject#preExecute
 * @fires CommandObject#postExecute
 */
class CommandObject extends ModelBase {

  //region Constructor

  /**
   * Creates a new asynchronous command object model instance.
   *
   * _The name of the model type available as:
   * __&lt;instance&gt;.constructor.modelType__, returns 'CommandObject'._
   *
   * @param {bo.shared.EventHandlerList} [eventHandlers] - The event handlers of the instance.
   *
   * @throws {@link bo.system.ArgumentError Argument error}:
   *    The event handlers must be an EventHandlerList object or null.
   */
  constructor(name, properties, rules, extensions, eventHandlers) {
    super();

    eventHandlers = Argument.inConstructor(name)
      .check(eventHandlers).forOptional('eventHandlers').asType(EventHandlerList);

    _properties.set( this, properties );
    // _rules.set( this, rules );
    _extensions.set( this, extensions );
    _eventHandlers.set( this, eventHandlers );
    // _store.set( this, store );
    _propertyContext.set( this, null );
    _isValidated.set( this, false );
    _brokenRules.set( this, new BrokenRuleList( name ) );
    _dataContext.set( this, null );

    // Get data access object.
    _dao.set( this, extensions.getDataAccessObject( name ) );

    // Set up business rules.
    rules.initialize(config.noAccessBehavior);

    // Set up event handlers.
    if (eventHandlers)
      eventHandlers.setup(this);

    /**
     * The name of the model. However, it can be hidden by a model property with the same name.
     *
     * @member CommandObject#$modelName
     * @type {string}
     * @readonly
     */
    this.$modelName = name;

    const store = new DataStore();

    //region Properties

    properties.map( property => {

      const isNormal = property.type instanceof DataType; // Not child element.
      if (isNormal) {
        // Initialize normal property.
        store.initValue( property );
        // Add data type check.
        rules.add( new DataTypeRule( property ) );
      }
      else
      // Create child item/collection.
        store.initValue( property, property.type.empty( this, eventHandlers ) );

      // Create normal property.
      Object.defineProperty( this, property.name, {
        get: () => {
          return readPropertyValue.call( this, property );
        },
        set: value => {
          if (!isNormal || property.isReadOnly)
            throw new ModelError( 'readOnly', name, property.name );
          writePropertyValue.call( this, property, value );
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
   * @member {string} CommandObject.modelType
   * @default CommandObject
   * @readonly
   */
  static get modelType() {
    return ModelType.CommandObject;
  }

  //endregion
}

/**
 * Factory method to create definitions of command object models.
 *
 * @name bo.CommandObject
 */
class CommandObjectFactory {

  //region Constructor

  /**
   * Creates a definition for a command object model.
   *
   *    Valid child model types are:
   *
   *      * ReadOnlyChildObject
   *      * ReadOnlyChildCollection
   *
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
  constructor(name, properties, rules, extensions) {
    const check = Argument.inConstructor(ModelType.CommandObject);

    name = check(name).forMandatory('name').asString();
    properties = check(properties).forMandatory('properties').asType(PropertyManager);
    rules = check(rules).forMandatory('rules').asType(RuleManager);
    extensions = check(extensions).forMandatory('extensions').asType(ExtensionManager);

    // Verify the model types of child objects.
    properties.modelName = name;
    properties.verifyChildTypes([
      ModelType.ReadOnlyChildObject,
      ModelType.ReadOnlyChildCollection
    ]);

    // Create model definition.
    const Model = CommandObject.bind( undefined, name, properties, rules, extensions );

    //region Factory methods

    /**
     * The name of the model type.
     *
     * @member {string} CommandObject.modelType
     * @default CommandObject
     * @readonly
     */
    Model.modelType = ModelType.CommandObject;

    /**
     * Creates a new command object instance.
     *
     * @function CommandObject.create
     * @param {bo.shared.EventHandlerList} [eventHandlers] - The event handlers of the instance.
     * @returns {CommandObject} Returns a new command object.
     *
     * @throws {@link bo.system.ArgumentError Argument error}:
     *      The event handlers must be an EventHandlerList object or null.
     * @throws {@link bo.system.ArgumentError Argument error}:
     *      The callback must be a function.
     */
    Model.create = function( eventHandlers ) {
      return new Model( eventHandlers );
    };

    //endregion

    // Immutable definition class.
    Object.freeze( Model );
    return Model;
  }

  //endregion
}
// Immutable factory class.
Object.freeze( CommandObjectFactory );

module.exports = CommandObjectFactory;
