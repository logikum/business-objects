'use strict';

var util = require('util');
var Enumeration = require('../shared/enumeration.js');

function NoAccessBehavior() {
  NoAccessBehavior.super_.call(this);

  this.throwError = 0;
  this.showError = 1;
  this.showWarning = 2;
  this.showInformation = 3;

  Object.freeze(this);
}
util.inherits(NoAccessBehavior, Enumeration);

module.exports = new NoAccessBehavior();
