'use strict';

var util = require('util');
var Enumeration = require('./enumeration.js');

/**
 * @classdesc Specifies the state of a model instance.
 * @description Creates a new enumeration to define model states.
 *
 * @memberof bo.shared
 * @constructor
 *
 * @extends bo.shared.Enumeration
 */
function ModelState() {
  ModelState.super_.call(this, 'ModelState');

  /**
   * The model instance is unchanged.
   * @type {number}
   * @readonly
   */
  this.pristine = 0;
  /**
   * The model instance is new.
   * @type {number}
   * @readonly
   */
  this.created = 1;
  /**
   * The model instance is changed.
   * @type {number}
   * @readonly
   */
  this.changed = 2;
  /**
   * The model instance is marked to delete.
   * @type {number}
   * @readonly
   */
  this.markedForRemoval = 3;
  /**
   * The model instance is deleted.
   * @type {number}
   * @readonly
   */
  this.removed = 4;

  // Immutable object.
  Object.freeze(this);
}
util.inherits(ModelState, Enumeration);

module.exports = new ModelState();
