'use strict';

var util = require('util');
var t = require('../locales/i18n-bo.js')('DataTypeError');

function DataTypeError() {
  DataTypeError.super_.call(this);

  this.name = 'DataTypeError';
  this.message = t.apply(this, arguments);
}
util.inherits(DataTypeError, Error);

module.exports = DataTypeError;
