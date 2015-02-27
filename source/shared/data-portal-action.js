'use strict';

var util = require('util');
var Enumeration = require('./../system/enumeration.js');

/**
 * @classdesc
 *    Specifies the operations of models to execute on data access objects.
 * @description
 *    Creates a new enumeration to define the data portal actions. Members:
 *
 *    * create
 *    * fetch
 *    * insert
 *    * update
 *    * remove
 *    * execute
 *
 * @memberof bo.shared
 * @constructor
 *
 * @extends bo.system.Enumeration
 */
function DataPortalAction () {
  Enumeration.call(this);

  /**
   * The user tries to initialize the values of a new model from the repository.
   * @type {number}
   * @readonly
   * @default 0
   */
  this.create = 0;
  /**
   * The user tries to retrieve the values of a model from the repository.
   * @type {number}
   * @readonly
   * @default 1
   */
  this.fetch = 1;
  /**
   * The user tries to save the values of a new model to the repository.
   * @type {number}
   * @readonly
   * @default 2
   */
  this.insert = 2;
  /**
   * The user tries to save the changed values of a model to the repository.
   * @type {number}
   * @readonly
   * @default 3
   */
  this.update = 3;
  /**
   * The user tries to delete the values of a model from the repository.
   * @type {number}
   * @readonly
   * @default 4
   */
  this.remove = 4;

  /**
   * The user tries to execute a command in the repository.
   * @type {number}
   * @readonly
   * @default 5
   */
  this.execute = 5;

  // Immutable object.
  Object.freeze(this);
}
util.inherits(DataPortalAction, Enumeration);

module.exports = new DataPortalAction();
