'use strict';

var util = require('util');
var Enumeration = require('./shared/enumeration.js');

function ModelState() {
  ModelState.super_.call(this);

  this.pristine = 0;
  this.created = 1;
  this.changed = 2;
  this.markedForRemoval = 3;
  this.removed = 4;

  Object.freeze(this);
}
util.inherits(ModelState, Enumeration);

module.exports = new ModelState();
