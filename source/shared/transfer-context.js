'use strict';

const Argument = require( '../system/argument-check.js' );
const ModelError = require( './model-error.js' );
const PropertyInfo = require( './property-info.js' );

const _getValue = new WeakMap();
const _setValue = new WeakMap();

function getByName( properties, name ) {
  for (let i = 0; i < properties.length; i++) {
    if (properties[ i ].name === name)
      return properties[ i ];
  }
  throw new ModelError( 'noProperty', properties.name, name );
}

/**
 * Provides the context for custom transfer objects.
 *
 * @memberof bo.shared
 */
class TransferContext {

  /**
   * Creates a new transfer context object.
   *   </br></br>
   * <i><b>Warning:</b> Transfer context objects are created in models internally.
   * They are intended only to make publicly available the values of model properties
   * for custom transfer objects.</i>
   *
   * @param {Array.<bo.shared.PropertyInfo>} [properties] - An array of property definitions.
   * @param {internal~getValue} [getValue] - A function that returns the current value of a property.
   * @param {internal~setValue} [setValue] - A function that changes the current value of a property.
   *
   * @throws {@link bo.system.ArgumentError Argument error}: The properties must be an array
   *    of PropertyInfo objects, or a single PropertyInfo object or null.
   * @throws {@link bo.system.ArgumentError Argument error}: The getValue argument must be a function.
   * @throws {@link bo.system.ArgumentError Argument error}: The setValue argument must be a function.
   */
  constructor( properties, getValue, setValue ) {
    const check = Argument.inConstructor( this.constructor.name );

    /**
     * Array of property definitions that may appear on the transfer object.
     * @type {Array.<bo.shared.PropertyInfo>}
     * @readonly
     */
    this.properties = check( properties ).forOptional( 'properties' ).asArray( PropertyInfo );

    getValue = check( getValue ).forOptional( 'getValue' ).asFunction();
    setValue = check( setValue ).forOptional( 'setValue' ).asFunction();

    _getValue.set( this, getValue );
    _setValue.set( this, setValue );

    // Immutable object.
    Object.freeze( this );
  }

  /**
   * Gets the current value of a model property.
   *
   * @param {string} propertyName - The name of the property.
   * @returns {*} The value of a model property.
   *
   * @throws {@link bo.system.ArgumentError Argument error}: The name must be a non-empty string.
   * @throws {@link bo.system.ArgumentError Argument error}: The model has no property with the given name.
   */
  getValue( propertyName ) {
    const getValue = _getValue.get( this );
    if (getValue) {
      propertyName = Argument.inMethod( this.constructor.name, 'getValue' )
        .check( propertyName ).forMandatory( 'propertyName' ).asString();
      return getValue( getByName( this.properties, propertyName ) );
    } else
      throw new ModelError( 'getValue' );
  }

  /**
   * Sets the current value of a model property.
   *
   * @param {string} propertyName - The name of the property.
   * @param {*} value - The new value of the property.
   *
   * @throws {@link bo.system.ArgumentError Argument error}: The name must be a non-empty string.
   * @throws {@link bo.system.ArgumentError Argument error}: The model has no property with the given name.
   */
  setValue( propertyName, value ) {
    const setValue = _setValue.get( this );
    if (setValue) {
      propertyName = Argument.inMethod( this.constructor.name, 'setValue' )
        .check( propertyName ).forMandatory( 'propertyName' ).asString();
      if (value !== undefined) {
        setValue( getByName( this.properties, propertyName ), value );
      }
    } else
      throw new ModelError( 'setValue' );
  }
}

module.exports = TransferContext;
