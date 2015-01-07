'use strict';

var CLASS_NAME = 'ArgumentError';

var util = require('util');
var t = require('../locales/i18n-bo.js')(CLASS_NAME);

function ArgumentError() {
  ArgumentError.super_.call(this);

  this.name = CLASS_NAME;
  this.message = t.apply(this, arguments);
}
util.inherits(ArgumentError, Error);

module.exports = ArgumentError;
