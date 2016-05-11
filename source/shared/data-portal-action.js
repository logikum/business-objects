'use strict';

var Enumeration = require('../system/enumeration.js');

/**
 * Specifies the operations of models to execute on data access objects. Members:
 *
 *    * create
 *    * fetch
 *    * insert
 *    * update
 *    * remove
 *    * execute
 *
 * @memberof bo.shared
 * @extends bo.system.Enumeration
 */
class DataPortalAction extends Enumeration {

  /**
   * Creates a new enumeration to define the data portal actions.
   */
  constructor() {
    super();

    /**
     * The user tries to initialize the values of a new model from the repository.
     * @constant {number} bo.shared.DataPortalAction#create
     * @default 0
     */
    this.create = 0;
    /**
     * The user tries to retrieve the values of a model from the repository.
     * @constant {number} bo.shared.DataPortalAction#fetch
     * @default 1
     */
    this.fetch = 1;
    /**
     * The user tries to save the values of a new model to the repository.
     * @constant {number} bo.shared.DataPortalAction#insert
     * @default 2
     */
    this.insert = 2;
    /**
     * The user tries to save the changed values of a model to the repository.
     * @constant {number} bo.shared.DataPortalAction#update
     * @default 3
     */
    this.update = 3;
    /**
     * The user tries to delete the values of a model from the repository.
     * @constant {number} bo.shared.DataPortalAction#remove
     * @default 4
     */
    this.remove = 4;

    /**
     * The user tries to execute a command in the repository.
     * @constant {number} bo.shared.DataPortalAction#execute
     * @default 5
     */
    this.execute = 5;

    // Immutable object.
    Object.freeze( this );
  }
}

module.exports = new DataPortalAction();
