'use strict';

var util = require('util');
var Enumeration = require('../shared/enumeration.js');

/**
 * @classdesc
 *    Specifies the behavior when an authorization rule fails.
 * @description
 *    Creates a new enumeration to define the behavior of unauthorized actions. Members:
 *    <ul>
 *      <li>throwError</li>
 *      <li>showError</li>
 *      <li>showWarning</li>
 *      <li>showInformation</li>
 *    </ul>
 *
 * @memberof bo.rules
 * @constructor
 *
 * @extends bo.shared.Enumeration
 */
function NoAccessBehavior() {
  Enumeration.call(this);

  /**
   * The rule throws an {@link bo.rules.AuthorizationError authorization error}.
   * @type {number}
   * @readonly
   * @default 0
   */
  this.throwError = 0;
  /**
   * The result of the rule is a broken rule with {@link bo.rules.RuleSeverity#error error severity}.
   * @type {number}
   * @readonly
   * @default 1
   */
  this.showError = 1;
  /**
   * The result of the rule is a broken rule with {@link bo.rules.RuleSeverity#warning warning severity}.
   * @type {number}
   * @readonly
   * @default 2
   */
  this.showWarning = 2;
  /**
   * The result of the rule is a broken rule with {@link bo.rules.RuleSeverity#information information severity}.
   * @type {number}
   * @readonly
   * @default 3
   */
  this.showInformation = 3;

  // Immutable object.
  Object.freeze(this);
}
util.inherits(NoAccessBehavior, Enumeration);

module.exports = new NoAccessBehavior();
