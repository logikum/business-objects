'use strict';

var util = require('util');
var Enumeration = require('./../system/enumeration.js');

/**
 * @classdesc
 *      Specifies the possible states of the editable model instances.
 *      This enumeration is used by the models internally to track the changes
 *      in the model instances. Its value is available through the
 *      getModelState() method.
 * @description
 *      Creates a new enumeration to define model states.
 *
 * @memberof bo.shared
 * @constructor
 *
 * @extends bo.system.Enumeration
 */
function ModelState () {
  Enumeration.call(this);

  /**
   * The model instance is unchanged.
   * @type {number}
   * @readonly
   * @default 0
   */
  this.pristine = 0;
  /**
   * The model instance is new.
   * @type {number}
   * @readonly
   * @default 1
   */
  this.created = 1;
  /**
   * The model instance is changed.
   * @type {number}
   * @readonly
   * @default 2
   */
  this.changed = 2;
  /**
   * The model instance is marked to delete.
   * @type {number}
   * @readonly
   * @default 3
   */
  this.markedForRemoval = 3;
  /**
   * The model instance is deleted.
   * @type {number}
   * @readonly
   * @default 4
   */
  this.removed = 4;

  // Immutable object.
  Object.freeze(this);
}
util.inherits(ModelState, Enumeration);

module.exports = new ModelState();
