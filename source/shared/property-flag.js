/**
 * Property flag set module.
 * @module shared/property-flag
 */
'use strict';

function PropertyFlag() {

  // Define flag items.
  this.none = 0;
  this.readOnly = 1;
  this.key = 2;
  this.parentKey = 4;
  this.notOnDto = 8;
  this.notOnCto = 16;

  // Immutable object.
  Object.freeze(this);
}

module.exports = new PropertyFlag();
