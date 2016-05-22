'use strict';

var events = require('events');
var util = require('util');

/**
 * @classdesc Serves as the base class for models.
 * @description Creates a base model instance.
 *
 * @constructor
 *
 * @extends EventEmitter
 */
function ModelBase () {
  events.EventEmitter.call(this);
}
util.inherits(ModelBase, events.EventEmitter);

// const events = require('events');
// const util = require('util');
//
// /**
//  * Serves as the base class for models.
//  *
//  * @extends EventEmitter
//  */
// class ModelBase extends events.EventEmitter {
//
//   /**
//    * Creates a base model instance.
//    */
//   constructor() {
//     super();
//   }
// }

module.exports = ModelBase;
