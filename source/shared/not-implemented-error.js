'use strict';

var CLASS_NAME = 'NotImplementedError';

var util = require('util');
var t = require('../locales/i18n-bo.js')(CLASS_NAME);

function NotImplementedError(message) {
  NotImplementedError.super_.call(this);

  this.name = CLASS_NAME;

  this.message = t.apply(this, message ? arguments : ['default']);
}
util.inherits(NotImplementedError, Error);

module.exports = NotImplementedError;
