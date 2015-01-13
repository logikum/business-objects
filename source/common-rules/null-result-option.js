/**
 * Null result option module.
 * @module common-rules/null-result-option
 */
'use strict';

var util = require('util');
var Enumeration = require('../shared/enumeration.js');

function NullResultOption() {
  NullResultOption.super_.call(this, 'NullResultOption');

  // Define enumeration members.
  this.returnTrue = 0;
  this.returnFalse = 1;
  this.convertToEmptyString = 2;

  // Immutable object.
  Object.freeze(this);
}
util.inherits(NullResultOption, Enumeration);

module.exports = new NullResultOption();
