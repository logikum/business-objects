'use strict';

const Argument = require( '../system/argument-check.js' );
const RuleBase = require( './rule-base.js' );
const RuleSeverity = require( './rule-severity.js' );
const ValidationResult = require( './validation-result.js' );
const PropertyInfo = require( '../shared/property-info.js' );

const _inputProperties = new WeakMap();
const _affectedProperties = new WeakMap();

/**
 * Represents a validation rule.
 *
 * @memberof bo.rules
 * @extends bo.rules.RuleBase
 */
class ValidationRule extends RuleBase {

  /**
   * Creates a new validation rule object.
   * The rule instances should be frozen.
   *
   * @param {string} ruleName - The name of the rule.
   *    It is typically the name of the constructor, without the Rule suffix.
   *
   * @throws {@link bo.system.ArgumentError Argument error}: The rule name must be a non-empty string.
   */
  constructor( ruleName ) {
    super( ruleName );

    /**
     * The definition of the property the rule relates to.
     * @member {bo.shared.PropertyInfo} bo.rules.ValidationRule#primaryProperty
     * @readonly
     */
    this.primaryProperty = null;

    _inputProperties.set( this, [] );
    _affectedProperties.set( this, [] );

    // Immutable object.
    Object.freeze( ValidationRule );
  }

  /**
   * Sets the properties of the rule.
   *
   * @param {bo.shared.PropertyInfo} primaryProperty - The property definition the rule relates to.
   * @param {string} message - Human-readable description of the rule failure.
   * @param {number} [priority=10] - The priority of the rule.
   * @param {boolean} [stopsProcessing=false] - Indicates the rule behavior in case of failure.
   *
   * @throws {@link bo.system.ArgumentError Argument error}: The primary property must be a PropertyInfo object.
   * @throws {@link bo.system.ArgumentError Argument error}: The message must be a non-empty string.
   */
  initialize( primaryProperty, message, priority, stopsProcessing ) {

    this.primaryProperty = Argument.inMethod( this.constructor.name, 'initialize' )
      .check( primaryProperty ).forMandatory( 'primaryProperty' ).asType( PropertyInfo );

    // Initialize base properties.
    RuleBase.prototype.initialize.call( this, message, priority, stopsProcessing );
  }

  /**
   * Adds an additional property to the rule that will use its value.
   *
   * @param {bo.shared.PropertyInfo} property - An input property that value is used by the rule of.
   *
   * @throws {@link bo.system.ArgumentError Argument error}: The input property must be a PropertyInfo object.
   */
  addInputProperty( property ) {

    property = Argument.inMethod( this.constructor.name, 'addInputProperty' )
      .check( property ).forMandatory( 'property' ).asType( PropertyInfo );

    const inputProperties = _inputProperties.get( this );
    if (inputProperties.indexOf( property ) < 0)
      inputProperties.push( property );
  }

  /**
   * Adds an additional property that is influenced by the rule.
   *
   * @param {bo.shared.PropertyInfo} property - An affected property influenced by the rule.
   *
   * @throws {@link bo.system.ArgumentError Argument error}: The affected property must be a PropertyInfo object.
   */
  addAffectedProperty( property ) {

    property = Argument.inMethod( this.constructor.name, 'addAffectedProperty' )
      .check( property ).forMandatory( 'property' ).asType( PropertyInfo );

    const affectedProperties = _affectedProperties.get( this );
    if (affectedProperties.indexOf( property ) < 0)
      affectedProperties.push( property );
  }

  /**
   * Returns the values of the properties that are used by the rule.
   * This method is called by the rule manager internally to provide
   * the values of the input properties for the execute() method.
   *
   * @protected
   * @param {internal~getValue} getValue - A function that returns the value of a property.
   * @returns {object} An object that properties hold the values of the input properties of.
   *
   * @throws {@link bo.system.ArgumentError Argument error}: The getValue argument must be a function..
   */
  getInputValues( getValue ) {

    getValue = Argument.inMethod( this.constructor.name, 'getInputValues' )
      .check( getValue ).forMandatory( 'getValue' ).asFunction();

    const inputValues = {};
    const inputProperties = _inputProperties.get( this );
    const combined = new Array( this.primaryProperty ).concat( inputProperties );

    for (let i = 0; i < combined.length; i++) {
      const property = combined[ i ];
      inputValues[ property.name ] = getValue( property );
    }
    return inputValues;
  }

  /**
   * Returns the result of the rule executed.
   *
   * @param {string} [message] - Human-readable description of the rule failure.
   * @param {bo.rules.RuleSeverity} severity - The severity of the failed rule.
   * @returns {bo.rules.ValidationResult} The result of the validation rule.
   */
  result( message, severity ) {

    const affectedProperties = _affectedProperties.get( this );
    const result = new ValidationResult(
      this.ruleName,
      this.primaryProperty.name,
      message || this.message
    );
    result.severity = Argument.inMethod( this.constructor.name, 'result' )
      .check( severity ).for( 'severity' ).asEnumMember( RuleSeverity, RuleSeverity.error );
    result.stopsProcessing = this.stopsProcessing;
    result.isPreserved = false;
    result.affectedProperties = affectedProperties;

    return result;
  }
}

module.exports = ValidationRule;
