'use strict';

var util = require('util');
var Enumeration = require('./enumeration.js');

function DataPortalEvent() {
  Enumeration.call(this);

  this.preFetch = 0;
  this.postFetch = 1;
  this.preCreate = 2;
  this.postCreate = 3;
  this.preSave = 4;
  this.postSave = 5;
  this.preInsert = 6;
  this.postInsert = 7;
  this.preUpdate = 8;
  this.postUpdate = 9;
  this.preRemove = 10;
  this.postRemove = 11;
  this.preExecute = 12;
  this.postExecute = 13;

  // Immutable object.
  Object.freeze(this);
}
util.inherits(DataPortalEvent, Enumeration);

module.exports = new DataPortalEvent();
