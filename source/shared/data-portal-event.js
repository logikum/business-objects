'use strict';

var util = require('util');
var Enumeration = require('../system/enumeration.js');

/**
 * @classdesc
 *    Specifies the events of models' data portal operations.
 * @description
 *    Creates a new enumeration to define the data portal events. Members:
 *
 *    * preFetch, postFetch
 *    * preCreate, postCreate
 *    * preInsert, postInsert
 *    * preUpdate, postUpdate
 *    * preRemove, postRemove
 *    * preExecute, postExecute
 *    * preSave, postSave
 *
 * @memberof bo.shared
 * @constructor
 *
 * @extends bo.system.Enumeration
 */
function DataPortalEvent () {
  Enumeration.call(this);

  /**
   * The event before a data portal fetch operation.
   * @type {number}
   * @readonly
   * @default 0
   */
  this.preFetch = 0;
  /**
   * The event after a data portal fetch operation.
   * @type {number}
   * @readonly
   * @default 1
   */
  this.postFetch = 1;
  /**
   * The event before a data portal create operation.
   * @type {number}
   * @readonly
   * @default 2
   */
  this.preCreate = 2;
  /**
   * The event after a data portal create operation.
   * @type {number}
   * @readonly
   * @default 3
   */
  this.postCreate = 3;
  /**
   * The event before a data portal insert operation.
   * @type {number}
   * @readonly
   * @default 4
   */
  this.preInsert = 4;
  /**
   * The event after a data portal insert operation.
   * @type {number}
   * @readonly
   * @default 5
   */
  this.postInsert = 5;
  /**
   * The event before a data portal update operation.
   * @type {number}
   * @readonly
   * @default 6
   */
  this.preUpdate = 6;
  /**
   * The event after a data portal update operation.
   * @type {number}
   * @readonly
   * @default 7
   */
  this.postUpdate = 7;
  /**
   * The event before a data portal remove operation.
   * @type {number}
   * @readonly
   * @default 8
   */
  this.preRemove = 8;
  /**
   * The event after a data portal remove operation.
   * @type {number}
   * @readonly
   * @default 9
   */
  this.postRemove = 9;
  /**
   * The event before a data portal execute operation.
   * @type {number}
   * @readonly
   * @default 10
   */
  this.preExecute = 10;
  /**
   * The event after a data portal execute operation.
   * @type {number}
   * @readonly
   * @default 11
   */
  this.postExecute = 11;
  /**
   * The event before a data portal save operation.
   * @type {number}
   * @readonly
   * @default 12
   */
  this.preSave = 12;
  /**
   * The event after a data portal save operation.
   * @type {number}
   * @readonly
   * @default 13
   */
  this.postSave = 13;

  // Immutable object.
  Object.freeze(this);
}
util.inherits(DataPortalEvent, Enumeration);

module.exports = new DataPortalEvent();
