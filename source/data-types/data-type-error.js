'use strict';

var CLASS_NAME = 'DataTypeError';

var util = require('util');
var t = require('../locales/i18n-bo.js')(CLASS_NAME);

function DataTypeError() {
  DataTypeError.super_.call(this);

  this.name = CLASS_NAME;
  this.message = t.apply(this, arguments);
}
util.inherits(DataTypeError, Error);

module.exports = DataTypeError;
