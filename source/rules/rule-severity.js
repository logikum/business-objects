'use strict';

var util = require('util');
var Enumeration = require('../shared/enumeration.js');

function RuleSeverity() {
  RuleSeverity.super_.call(this, 'RuleSeverity');

  // Define enumeration members.
  this.success = 0;
  this.information = 1;
  this.warning = 2;
  this.error = 3;

  // Immutable object.
  Object.freeze(this);
}
util.inherits(RuleSeverity, Enumeration);

module.exports = new RuleSeverity();
