'use strict';

//region Imports

const t = require( '../locales/i18n-bo.js' )( 'Rules' );
const Argument = require( '../system/argument-check.js' );
const AuthorizationRule = require( '../rules/authorization-rule.js' );
const UserInfo = require( '../system/user-info.js' );

//endregion

/**
 * The rule ensures that the user is not member of any role from a group.
 *
 * @memberof bo.commonRules
 * @extends bo.rules.AuthorizationRule
 */
class IsNotInAnyRoleRule extends AuthorizationRule {

  /**
   * Creates a new is-not-in-any-role rule object.
   *
   * @param {bo.rules.AuthorizationAction} action - The action to be authorized.
   * @param {(bo.common.PropertyInfo|string|null)} [target] - Eventual parameter of the authorization action.
   * @param {Array.<string>} roles - The names of the roles the user cannot be member of.
   * @param {string} message - Human-readable description of the rule failure.
   * @param {number} [priority=100] - The priority of the rule.
   * @param {boolean} [stopsProcessing=false] - Indicates the rule behavior in case of failure.
   *
   * @throws {@link bo.system.ArgumentError Argument error}: The action must be a AuthorizationAction item.
   * @throws {@link bo.system.ArgumentError Argument error}: The target must be a PropertyInfo object in case of property read or write.
   * @throws {@link bo.system.ArgumentError Argument error}: The target must be a non-empty string in case of method execution.
   * @throws {@link bo.system.ArgumentError Argument error}: The target must be null in case of model actions.
   * @throws {@link bo.system.ArgumentError Argument error}: The roles must be an array of string values.
   * @throws {@link bo.system.ArgumentError Argument error}: The message must be a non-empty string.
   */
  constructor( action, target, roles, message, priority, stopsProcessing ) {
    super( 'IsNotInAnyRole' );

    /**
     * The names of the roles the user cannot be member of.
     * @member {Array.<string>} bo.commonRules.IsNotInAnyRoleRule#roles
     * @readonly
     */
    this.roles = Argument.inConstructor( IsNotInAnyRoleRule.name )
      .check( roles ).forMandatory( 'roles' ).asArray( String );

    // Initialize base properties.
    this.initialize(
      action,
      target,
      message || t( 'isNotInAnyRole', roles ),
      priority,
      stopsProcessing
    );

    // Immutable object.
    Object.freeze( this );
  }

  /**
   * Checks if the  user is not member of any role from the defined group.
   *
   * @function bo.commonRules.IsNotInAnyRoleRule#execute
   * @param {bo.system.UserInfo} userInfo - Information about the current user.
   * @returns {(bo.rules.AuthorizationResult|undefined)} Information about the failure.
   */
  execute( userInfo ) {

    userInfo = Argument.inMethod( IsNotInAnyRoleRule.name, 'execute' )
      .check( userInfo ).forOptional( 'userInfo' ).asType( UserInfo );

    let hasPermission = true;

    if (userInfo) {
      if (this.roles.length > 0) {
        for (let i = 0; i < this.roles.length; i++) {
          const role = this.roles[ i ];
          if (userInfo.isInRole( role )) {
            hasPermission = false;
            break;
          }
        }
      } else
        hasPermission = true;
    } else
      hasPermission = this.roles.length === 0;

    if (!hasPermission)
      return this.result( this.message );
  }
}

module.exports = IsNotInAnyRoleRule;
