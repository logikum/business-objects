'use strict';

const Argument = require( '../system/argument-check.js' );
const ModelError = require( './model-error.js' );
const PropertyInfo = require( './property-info.js' );

const _getValue = new WeakMap();
const _setValue = new WeakMap();
const _primaryProperty = new WeakMap();

function getByName( name ) {
  for (let i = 0; i < this.properties.length; i++) {
    if (this.properties[ i ].name === name)
      return this.properties[ i ];
  }
  throw new ModelError( 'noProperty', this.modelName, name );
}

/**
 * Provides the context for custom property functions.
 *
 * @memberof bo.shared
 */
class PropertyContext {

  /**
   * Creates a new property context object.
   *   </br></br>
   * <i><b>Warning:</b> Property context objects are created in models internally.
   * They are intended only to make publicly available the context
   * for custom property functions.</i>
   *
   * @param {string} modelName - The name of the business object model.
   * @param {Array.<bo.shared.PropertyInfo>} properties - An array of property definitions.
   * @param {internal~getValue} [getValue] - A function that returns the current value of a property.
   * @param {internal~setValue} [setValue] - A function that changes the current value of a property.
   *
   * @throws {@link bo.system.ArgumentError Argument error}: The model name must be a non-empty string.
   * @throws {@link bo.system.ArgumentError Argument error}: The properties must be an array
   *    of PropertyInfo objects, or a single PropertyInfo object or null.
   * @throws {@link bo.system.ArgumentError Argument error}: The getValue argument must be a function.
   * @throws {@link bo.system.ArgumentError Argument error}: The setValue argument must be a function.
   */
  constructor( modelName, properties, getValue, setValue ) {
    const check = Argument.inConstructor( PropertyContext.name );

    /**
     * The name of the business object model.
     * @member {string} bo.shared.PropertyContext#modelName
     * @readonly
     */
    this.modelName = check( modelName ).forMandatory( 'modelName' ).asString();

    /**
     * Array of property definitions that may used by the custom function.
     * @member {Array.<bo.shared.PropertyInfo>} bo.shared.PropertyContext#properties
     * @readonly
     */
    this.properties = check( properties ).forOptional( 'properties' ).asArray( PropertyInfo );

    _getValue.set( this, check( getValue ).forOptional( 'getValue' ).asFunction() );
    _setValue.set( this, check( setValue ).forOptional( 'setValue' ).asFunction() );
    _primaryProperty.set( this, null );

    // Immutable object.
    Object.freeze( this );
  }

  /**
   * The primary property of the custom function.
   * @member {bo.shared.PropertyInfo} bo.shared.PropertyContext#primaryProperty
   * @readonly
   */
  get primaryProperty() {
    return _primaryProperty.get( this );
  }

  /**
   * Sets the primary property of the custom function.
   *
   * @param {bo.shared.PropertyInfo} property - The primary property of the custom function.
   * @returns {bo.shared.PropertyContext} The property context object itself.
   */
  with( property ) {
    _primaryProperty.set( this, Argument.inMethod( PropertyContext.name, 'with' )
      .check( property ).forMandatory( 'property' ).asType( PropertyInfo ) );
    return this;
  }

  /**
   * Gets the current value of a model property.
   *
   * @param {string} propertyName - The name of the property.
   * @returns {*} The value of the model property.
   *
   * @throws {@link bo.system.ArgumentError Argument error}: The name must be a non-empty string.
   * @throws {@link bo.system.ArgumentError Argument error}: The model has no property with the given name.
   * @throws {@link bo.shared.ModelError Model error}: The property cannot be read.
   */
  getValue( propertyName ) {
    propertyName = Argument.inMethod( PropertyContext.name, 'getValue' )
      .check( propertyName ).forMandatory( 'propertyName' ).asString();
    const getValue = _getValue.get( this );
    if (getValue) {
      const findProperty = getByName.bind( this );
      return getValue( findProperty( propertyName ) );
    } else
      throw new ModelError( 'readProperty', this.modelName, propertyName );
  }

  /**
   * Sets the current value of a model property.
   *
   * @param {string} propertyName - The name of the property.
   * @param {*} value - The new value of the property.
   *
   * @throws {@link bo.system.ArgumentError Argument error}: The name must be a non-empty string.
   * @throws {@link bo.system.ArgumentError Argument error}: The model has no property with the given name.
   * @throws {@link bo.shared.ModelError Model error}: The property cannot be written.
   */
  setValue( propertyName, value ) {
    propertyName = Argument.inMethod( PropertyContext.name, 'setValue' )
      .check( propertyName ).forMandatory( 'propertyName' ).asString();
    const setValue = _setValue.get( this );
    if (setValue) {
      if (value !== undefined) {
        const findProperty = getByName.bind( this );
        setValue( findProperty( propertyName ), value );
      }
    } else
      throw new ModelError( 'writeProperty', this.modelName, propertyName );
  }
}

module.exports = PropertyContext;
