'use strict';

const Argument = require( '../system/argument-check.js' );
const PropertyInfo = require( './property-info.js' );
const CollectionBase = require( '../collection-base.js' );
const CollectionBase2 = require( '../collection-base-2.js' );
const ModelBase = require( '../model-base.js' );
const ModelBase2 = require( '../model-base-2.js' );

const _data = new WeakMap();
const _validity = new WeakMap();

function getPropertyValue( target, propertyName ) {
  const data = _data.get( target );
  return data.get( propertyName );
}
function setPropertyValue( target, propertyName, value ) {
  const data = _data.get( target );
  data.set( propertyName, value );
  _data.set( target, data );
}
function getValidity( target, propertyName ) {
  const validity = _validity.get( target );
  return validity.get( propertyName ) || false;
}
function setValidity( target, propertyName, value ) {
  const validity = _validity.get( target );
  validity.set( propertyName, value );
  _validity.set( target, validity );
}

/**
 * Provides methods to manage the values of business object model's properties.
 *
 * @memberof bo.shared
 */
class DataStore {

  /**
   * Creates a new data store object.
   */
  constructor() {

    _data.set( this, new Map() );
    _validity.set( this, new Map() );

    // Immutable object.
    Object.freeze( this );
  }

  /**
   * Initializes the value of a property in the store.
   *
   * @param {bo.shared.PropertyInfo} property - The definition of the model property.
   * @param {*} value - The default value of the property (null or a child object).
   *
   * @throws {@link bo.system.ArgumentError Argument error}: The property must be a PropertyInfo object.
   * @throws {@link bo.system.ArgumentError Argument error}: The value must be null, a model or a collection.
   */
  initValue( property, value ) {
    const check = Argument.inMethod( DataStore.name, 'initValue' );

    property = check( property ).forMandatory( 'property' ).asType( PropertyInfo );
    // TODO
    value = check( value ).forOptional( 'value' ).asType( [
      CollectionBase, CollectionBase2, ModelBase, ModelBase2 ] );

    setPropertyValue( this, property.name, value );
    setValidity( this, property.name, true );
  }

  /**
   * Gets the value of a model property.
   *
   * @param {bo.shared.PropertyInfo} property - The definition of the model property.
   * @returns {*} The current value of the property.
   *
   * @throws {@link bo.system.ArgumentError Argument error}: The property must be a PropertyInfo object.
   */
  getValue( property ) {

    property = Argument.inMethod( DataStore.name, 'getValue' )
      .check( property ).forMandatory( 'property' ).asType( PropertyInfo );

    return getPropertyValue( this, property.name );
  }

  /**
   * Sets the value of a model property.
   *
   * @param {bo.shared.PropertyInfo} property - The definition of the model property.
   * @param {*} value - The new value of the property.
   * @returns {boolean} True if the value of the property has been changed, otherwise false.
   *
   * @throws {@link bo.system.ArgumentError Argument error}: The property must be a PropertyInfo object.
   * @throws {@link bo.system.ArgumentError Argument error}: The value must be defined.
   */
  setValue( property, value ) {
    const check = Argument.inMethod( DataStore.name, 'setValue' );

    property = check( property ).forMandatory( 'property' ).asType( PropertyInfo );
    value = check( value ).for( 'value' ).asDefined();

    // Check value.
    const parsed = property.type.parse( value );
    if (parsed === undefined) {
      // Invalid value.
      setValidity( this, property.name, false );
      return false;
    } else {
      // Valid value.
      if (parsed !== getPropertyValue( this, property.name )) {
        // Value has changed.
        setPropertyValue( this, property.name, parsed );
        setValidity( this, property.name, true );
        return true;
      } else {
        // Value is unchanged.
        setValidity( this, property.name, true );
        return false;
      }
    }
  }

  /**
   * Indicates whether a property has a valid value.
   *
   * @param {bo.shared.PropertyInfo} property - The definition of the model property.
   * @returns {boolean} True if the property has a valid value, otherwise false.
   */
  hasValidValue( property ) {

    property = Argument.inMethod( DataStore.name, 'hasValidValue' )
      .check( property ).forMandatory( 'property' ).asType( PropertyInfo );

    return getValidity( this, property.name );
  }
}

module.exports = DataStore;
