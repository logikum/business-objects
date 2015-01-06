'use strict';

var CLASS_NAME = 'DataTypeError';

var util = require('util');
var t = require('../locales/i18n-bo.js')(CLASS_NAME);

function DataTypeError(message) {
  DataTypeError.super_.call(this);

  this.name = CLASS_NAME;

  this.message = t.apply(this, message ? arguments : ['default']);
}
util.inherits(DataTypeError, Error);

module.exports = DataTypeError;
