'use strict';

var CLASS_NAME = 'EnumerationError';

var util = require('util');
var t = require('../locales/i18n-bo.js')(CLASS_NAME);

function EnumerationError(message) {
  EnumerationError.super_.call(this);

  this.name = CLASS_NAME;

  this.message = t.apply(this, message ? arguments : ['default']);
}
util.inherits(EnumerationError, Error);

module.exports = EnumerationError;
