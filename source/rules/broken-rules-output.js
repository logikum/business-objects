'use strict';

const Argument = require( '../system/argument-check.js' );
const RuleNotice = require( './rule-notice.js' );

const _length = new WeakMap();
const _count = new WeakMap();
const _childObjects = new WeakMap();
const _childCollections = new WeakMap();

function incrementLength( target ) {
  let length = _length.get( target );
  length++;
  _length.set( target, length );
}

function incrementCount( target ) {
  let count = _count.get( target );
  count++;
  _count.set( target, count );
}

/**
 * Represents the public format of broken rules. The output object
 * has a property for each model property that has broken rule.
 *
 * If the model property is a simple property, i.e. it is defined by
 * a {@link bo.dataTypes.DataType data type}, then the output property
 * is an array. The array elements are {@link bo.rules.RuleNotice rule notice}
 * objects representing the broken rules.
 *
 * If the model property is a child object, then the output property
 * is an object as well, whose properties represents model properties
 * with broken rules, as described above.
 *
 * If the model property is a child collection, then the output property
 * is an object as well, whose properties are the indeces of the items of
 * the collections. The property name is a number in '00000' format. The
 * property value represents the child item, as described above.
 *
 * @memberof bo.rules
 */
class BrokenRulesOutput {

  /**
   * Creates a new broken rules output instance.
   */
  constructor() {

    _length.set( this, 0 );
    _count.set( this, 0 );
    _childObjects.set( this, [] );
    _childCollections.set( this, [] );

    /**
     * Returns the count of properties that have broken rules.
     * @member {number} bo.rules.BrokenRulesOutput#$length
     * @readonly
     */
    Object.defineProperty( this, '$length', {
      get: function () {
        return _length.get( this );
      },
      enumerable: false
    } );

    /**
     * Returns the count of broken rules.
     * @member {number} bo.rules.BrokenRulesOutput#$count
     * @readonly
     */
    Object.defineProperty( this, '$count', {
      get: function () {
        let total = _count.get( this );

        // Add notice counts of child objects.
        const childObjects = _childObjects.get( this );
        childObjects.forEach( function ( childName ) {
          total += self[ childName ].$count;
        } );

        // Add notice counts of child collection items.
        const childCollections = _childCollections.get( this );
        childCollections.forEach( function ( collectionName ) {
          const collection = self[ collectionName ];
          for (const index in collection) {
            if (collection.hasOwnProperty( index ))
              total += collection[ index ].$count;
          }
        } );

        return total;
      },
      enumerable: false
    } );
  }

  /**
   * Adds a rule notice to the response object.
   *
   * @param {string} propertyName - The name of the property.
   * @param {bo.rules.RuleNotice} notice - The public form of the broken rule.
   *
   * @throws {@link bo.system.ArgumentError Argument error}: The property name must be a non-empty string.
   * @throws {@link bo.system.ArgumentError Argument error}: The notice must be a RuleNotice object.
   */
  add( propertyName, notice ) {
    const check = Argument.inMethod( this.constructor.name, 'add' );

    propertyName = check( propertyName ).forMandatory( 'propertyName' ).asString();
    notice = check( notice ).forMandatory( 'notice' ).asType( RuleNotice );

    if (this[ propertyName ])
      this[ propertyName ].push( notice );
    else {
      this[ propertyName ] = new Array( notice );
      incrementLength( this );
    }
    incrementCount( this );
  }

  /**
   * Adds a child response object to the response object.
   *
   * @param {string} propertyName - The name of the property.
   * @param {bo.rules.BrokenRulesOutput} output - The response object of a child property.
   *
   * @throws {@link bo.system.ArgumentError Argument error}: The property name must be a non-empty string.
   * @throws {@link bo.system.ArgumentError Argument error}: The output must be a BrokenRulesOutput object.
   */
  addChild( propertyName, output ) {
    const check = Argument.inMethod( this.constructor.name, 'addChild' );

    propertyName = check( propertyName ).forMandatory( 'propertyName' ).asString();
    output = check( output ).forMandatory( 'output' ).asType( BrokenRulesOutput );

    this[ propertyName ] = output;

    const childObjects = _childObjects.get( this );
    childObjects.push( propertyName );
    _childObjects.set( this, childObjects );

    incrementLength( this );
  }

  /**
   * Adds child response objects to the response object.
   *
   * @param {string} propertyName - The name of the property.
   * @param {Array.<bo.rules.BrokenRulesOutput>} outputs - The response objects of a child collection property.
   *
   * @throws {@link bo.system.ArgumentError Argument error}: The property name must be a non-empty string.
   * @throws {@link bo.system.ArgumentError Argument error}:
   *    The outputs must be an array of BrokenRulesOutput objects or a single BrokenRulesOutput object.
   */
  addChildren( propertyName, outputs ) {
    const check = Argument.inMethod( this.constructor.name, 'addChildren' );

    propertyName = check( propertyName ).forMandatory( 'propertyName' ).asString();
    outputs = check( outputs ).forMandatory( 'outputs' ).asArray( BrokenRulesOutput );

    let list = {};
    outputs.forEach( ( output, index ) => {
      list[ ('00000' + index.toString()).slice( -5 ) ] = output;
      //list[index.toString()] = output;
    } );
    this[ propertyName ] = list;

    const childCollections = _childCollections.get( this );
    childCollections.push( propertyName );
    _childCollections.set( this, childCollections );

    incrementLength( this );
  }
}

module.exports = BrokenRulesOutput;
