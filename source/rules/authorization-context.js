'use strict';

var CLASS_NAME = 'AuthorizationContext';

var config = require('../shared/configuration-reader.js');
var Argument = require('../system/argument-check.js');
var UserInfo = require('../system/user-info.js');
var BrokenRuleList = require('./broken-rule-list.js');
var AuthorizationAction = require('./authorization-action.js');

/**
 * @classdesc
 *    Provides the context for custom authorization rules.
 * @description
 *    Creates a new authorization context object.
 *      </br></br>
 *    <i><b>Warning:</b> Authorization context objects are created in models internally.
 *    They are intended only to make publicly available the context
 *    for custom authorization rules.</i>
 *
 * @memberof bo.rules
 * @constructor
 * @param {bo.rules.AuthorizationAction} action - The operation to authorize.
 * @param {string} [targetName] - Eventual parameter of the authorization action.
 * @param {bo.rules.BrokenRuleList} brokenRules - The list of the broken rules.
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The action must be an AuthorizationAction item.
 * @throws {@link bo.system.ArgumentError Argument error}: The target name must be a string value.
 * @throws {@link bo.system.ArgumentError Argument error}: The broken rules must be a BrokenRuleList object.
 */
function AuthorizationContext (action, targetName, brokenRules) {
  var check = Argument.inConstructor(CLASS_NAME);

  action = check(action).for('action').asEnumMember(AuthorizationAction, null);
  targetName = check(targetName).for('targetName').asString();

  /**
   * The list of the broken rules.
   * @type {bo.rules.BrokenRuleList}
   * @readonly
   */
  this.brokenRules = check(brokenRules).forMandatory('brokenRules').asType(BrokenRuleList);

  /**
   * The identifier of the authorization action. Generally it is the action value,
   * or when target is not empty, the action value and the target name separated by
   * a dot, respectively.
   * @type {string}
   * @readonly
   */
  this.ruleId = AuthorizationAction.getName(action);
  if (targetName)
    this.ruleId += '.' + targetName;

  /**
   * The current user.
   * @type {bo.system.UserInfo}
   * @readonly
   */
  this.user = config.getUser();
  /**
   * The current locale.
   * @type {string}
   * @readonly
   */
  this.locale = config.getLocale();

  // Immutable object.
  Object.freeze(this);
}

module.exports = AuthorizationContext;
