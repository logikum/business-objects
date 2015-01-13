'use strict';

var util = require('util');
var t = require('../locales/i18n-bo.js')('EnumerationError');

function EnumerationError() {
  EnumerationError.super_.call(this);

  this.name = 'EnumerationError';
  this.message = t.apply(this, arguments);
}
util.inherits(EnumerationError, Error);

module.exports = EnumerationError;
