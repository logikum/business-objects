'use strict';

var util = require('util');
var Enumeration = require('../shared/enumeration.js');

/**
 * @classdesc Specifies the behavior of a failed authorization rule.
 * @description Creates a new enumeration to define the behavior of unauthorized accesses.
 *
 * @memberof bo.rules
 * @constructor
 *
 * @extends bo.shared.Enumeration
 */
function NoAccessBehavior() {
  NoAccessBehavior.super_.call(this, 'NoAccessBehavior');

  /**
   * The rule throws an {@link bo.rules.AuthorizationError authorization error}.
   * @type {number}
   * @readonly
   */
  this.throwError = 0;
  /**
   * The result of the rule is a broken rule with {@link bo.rules.RuleSeverity#error error severity}.
   * @type {number}
   * @readonly
   */
  this.showError = 1;
  /**
   * The result of the rule is a broken rule with {@link bo.rules.RuleSeverity#warning warning severity}.
   * @type {number}
   * @readonly
   */
  this.showWarning = 2;
  /**
   * The result of the rule is a broken rule with {@link bo.rules.RuleSeverity#information information severity}.
   * @type {number}
   * @readonly
   */
  this.showInformation = 3;

  // Immutable object.
  Object.freeze(this);
}
util.inherits(NoAccessBehavior, Enumeration);

module.exports = new NoAccessBehavior();
