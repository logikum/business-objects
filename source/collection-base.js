'use strict';

var events = require('events');
var util = require('util');

/**
 * @classdesc Serves as the base class for colections.
 * @description Creates a base collection instance.
 *
 * @constructor
 *
 * @extends EventEmitter
 */
function CollectionBase () {
  events.EventEmitter.call(this);
}
util.inherits(CollectionBase, events.EventEmitter);

// const events = require( 'events' );
// const util = require( 'util' );
//
// /**
//  * Serves as the base class for collections.
//  *
//  * @extends EventEmitter
//  */
// class CollectionBase extends events.EventEmitter {
//
//   /**
//    * Creates a base collection instance.
//    */
//   constructor() {
//     super();
//   }
// }

module.exports = CollectionBase;
