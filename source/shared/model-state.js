/**
 * Model state module.
 * @module shared/model-state
 */
'use strict';

var util = require('util');
var Enumeration = require('./enumeration.js');

function ModelState() {
  ModelState.super_.call(this, 'ModelState');

  // Define enumeration members.
  this.pristine = 0;
  this.created = 1;
  this.changed = 2;
  this.markedForRemoval = 3;
  this.removed = 4;

  // Immutable object.
  Object.freeze(this);
}
util.inherits(ModelState, Enumeration);

module.exports = new ModelState();
