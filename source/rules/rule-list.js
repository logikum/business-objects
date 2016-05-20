'use strict';

const Argument = require( '../system/argument-check.js' );
const AuthorizationRule = require( './authorization-rule.js' );
const ValidationRule = require( './validation-rule.js' );

// Rules are sorted descending by priority.
function sortByPriority( a, b ) {
  if (a.priority > b.priority) {
    return -1;
  }
  if (a.priority < b.priority) {
    return 1;
  }
  return 0;
}

/**
 * Represents the lists of rules of a model instance.
 *
 * @memberof bo.rules
 */
class RuleList {

  /**
   * Adds a new rule to the list of rules of its owner property.
   *
   * @function bo.rules.RuleList#add
   * @param {string} id - The identifier of the rule list, typically the property name.
   * @param {(bo.rules.ValidationRule|bo.rules.AuthorizationRule)} rule - A validation or authorization rule.
   *
   * @throws {@link bo.system.ArgumentError Argument error}: The identifier must be a non-empty string.
   * @throws {@link bo.system.ArgumentError Argument error}: The rule must be a ValidationRule or AuthorizationRule object.
   */
  add( id, rule ) {
    const check = Argument.inMethod( this.constructor.name, 'add' );

    id = check( id ).forMandatory( 'id' ).asString();
    rule = check( rule ).forMandatory( 'rule' ).asType( [ ValidationRule, AuthorizationRule ] );

    if (this[ id ])
      this[ id ].push( rule );
    else
      this[ id ] = new Array( rule );
  }

  /**
   * Sorts the lists of rules by {@link bo.rules.RuleBase#priority rule priority}.
   *
   * @function bo.rules.RuleList#sort
   */
  sort() {
    for (const id in this) {
      if (this.hasOwnProperty( id ) && this[ id ] instanceof Array) {
        this[ id ].sort( sortByPriority );
      }
    }
  }
}

module.exports = RuleList;
