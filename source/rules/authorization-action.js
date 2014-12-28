'use strict';

var util = require('util');
var Enumeration = require('../shared/enumeration.js');

function AuthorizationAction() {
  AuthorizationAction.super_.call(this);

  // Define enumeration members.
  this.readProperty = 0;
  this.writeProperty = 1;

  this.fetchObject = 2;
  this.createObject = 3;
  this.updateObject = 4;
  this.removeObject = 5;

  this.executeCommand = 6;
  this.executeMethod = 7;

  // Immutable object.
  Object.freeze(this);
}
util.inherits(AuthorizationAction, Enumeration);

module.exports = new AuthorizationAction();
