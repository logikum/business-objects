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

module.exports = CollectionBase;
