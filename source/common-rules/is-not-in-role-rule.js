'use strict';

//region Imports

const t = require( '../locales/i18n-bo.js' )( 'Rules' );
const Argument = require( '../system/argument-check.js' );
const AuthorizationRule = require( '../rules/authorization-rule.js' );
const UserInfo = require( '../system/user-info.js' );

//endregion

/**
 * The rule ensures that the user is not member of a role.
 *
 * @memberof bo.commonRules
 * @extends bo.rules.AuthorizationRule
 */
class IsNotInRoleRule extends AuthorizationRule {

  /**
   * Creates a new is-not-in-role rule object.
   *
   * @param {bo.rules.AuthorizationAction} action - The action to be authorized.
   * @param {(bo.common.PropertyInfo|string|null)} [target] - Eventual parameter of the authorization action.
   * @param {string} role - The name of the role the user is not member of.
   * @param {string} message - Human-readable description of the rule failure.
   * @param {number} [priority=100] - The priority of the rule.
   * @param {boolean} [stopsProcessing=false] - Indicates the rule behavior in case of failure.
   *
   * @throws {@link bo.system.ArgumentError Argument error}: The action must be a AuthorizationAction item.
   * @throws {@link bo.system.ArgumentError Argument error}: The target must be a PropertyInfo object in case of property read or write.
   * @throws {@link bo.system.ArgumentError Argument error}: The target must be a non-empty string in case of method execution.
   * @throws {@link bo.system.ArgumentError Argument error}: The target must be null in case of model actions.
   * @throws {@link bo.system.ArgumentError Argument error}: The role must be a non-empty string.
   * @throws {@link bo.system.ArgumentError Argument error}: The message must be a non-empty string.
   */
  constructor( action, target, role, message, priority, stopsProcessing ) {
    super( 'IsNotInRole' );

    /**
     * The name of the role the user is not member of.
     * @member {string} bo.commonRules.IsNotInRoleRule#role
     * @readonly
     */
    this.role = Argument.inConstructor( IsNotInRoleRule.name )
      .check( role ).forMandatory( 'role' ).asString();

    // Initialize base properties.
    this.initialize(
      action,
      target,
      message || t( 'isNotInRole', role ),
      priority,
      stopsProcessing
    );

    // Immutable object.
    Object.freeze( this );
  }

  /**
   * Checks if the  user is not member of the defined role.
   *
   * @function bo.commonRules.IsNotInRoleRule#execute
   * @param {bo.system.UserInfo} userInfo - Information about the current user.
   * @returns {(bo.rules.AuthorizationResult|undefined)} Information about the failure.
   */
  execute( userInfo ) {

    userInfo = Argument.inMethod( IsNotInRoleRule.name, 'execute' )
      .check( userInfo ).forOptional( 'userInfo' ).asType( UserInfo );

    const hasPermission = !userInfo.isInRole( this.role );

    if (!hasPermission)
      return this.result( this.message );
  }
}

module.exports = IsNotInRoleRule;
