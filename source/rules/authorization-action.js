'use strict';

var util = require('util');
var Enumeration = require('../shared/enumeration.js');

/**
 * @classdesc
 *    Specifies the operations of models to authorize.
 * @description
 *    Creates a new enumeration to define the authorization actions. Members:
 *    <ul>
 *      <li>readProperty</li>
 *      <li>writeProperty</li>
 *      <li>fetchObject</li>
 *      <li>createObject</li>
 *      <li>updateObject</li>
 *      <li>removeObject</li>
 *      <li>executeCommand</li>
 *      <li>executeMethod</li>
 *    </ul>
 *
 * @memberof bo.rules
 * @constructor
 *
 * @extends bo.shared.Enumeration
 */
function AuthorizationAction() {
  Enumeration.call(this);

  /**
   * The user tries to get the value of a property.
   * @type {number}
   * @readonly
   * @default 0
   */
  this.readProperty = 0;
  /**
   * The user tries to set the value of a property.
   * @type {number}
   * @readonly
   * @default 1
   */
  this.writeProperty = 1;

  /**
   * The user tries to retrieve the values of a model from the repository.
   * @type {number}
   * @readonly
   * @default 2
   */
  this.fetchObject = 2;
  /**
   * The user tries to save the values of a new model to the repository.
   * @type {number}
   * @readonly
   * @default 3
   */
  this.createObject = 3;
  /**
   * The user tries to save the changed values of a model to the repository.
   * @type {number}
   * @readonly
   * @default 4
   */
  this.updateObject = 4;
  /**
   * The user tries to delete the values of a model from the repository.
   * @type {number}
   * @readonly
   * @default 5
   */
  this.removeObject = 5;

  /**
   * The user tries to execute a command in the repository.
   * @type {number}
   * @readonly
   * @default 6
   */
  this.executeCommand = 6;
  /**
   * The user tries to execute a custom action in the repository.
   * It can be a custom fetch or execute action.
   * @type {number}
   * @readonly
   * @default 7
   */
  this.executeMethod = 7;

  // Immutable object.
  Object.freeze(this);
}
util.inherits(AuthorizationAction, Enumeration);

module.exports = new AuthorizationAction();
