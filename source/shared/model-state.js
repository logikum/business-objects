'use strict';

var Enumeration = require( '../system/enumeration.js' );

/**
 * Specifies the possible states of the editable model instances.
 * This enumeration is used by the models internally to track the changes
 * in the model instances. Its value is available through the
 * getModelState() method.
 *
 * @memberof bo.shared
 * @extends bo.system.Enumeration
 */
class ModelState extends Enumeration {

  /**
   * Creates a new enumeration to define model states..
   */
  constructor() {
    super();

    /**
     * The model instance is unchanged.
     * @constant {number} bo.shared.ModelState#pristine
     * @default 0
     */
    this.pristine = 0;
    /**
     * The model instance is new.
     * @constant {number} bo.shared.ModelState#created
     * @default 1
     */
    this.created = 1;
    /**
     * The model instance is changed.
     * @constant {number} bo.shared.ModelState#changed
     * @default 2
     */
    this.changed = 2;
    /**
     * The model instance is marked to delete.
     * @constant {number} bo.shared.ModelState#markedForRemoval
     * @default 3
     */
    this.markedForRemoval = 3;
    /**
     * The model instance is deleted.
     * @constant {number} bo.shared.ModelState#removed
     * @default 4
     */
    this.removed = 4;

    // Immutable object.
    Object.freeze( this );
  }
}

module.exports = new ModelState();
