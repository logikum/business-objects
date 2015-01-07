'use strict';

var CLASS_NAME = 'NotImplementedError';

var util = require('util');
var t = require('../locales/i18n-bo.js')(CLASS_NAME);

function NotImplementedError() {
  NotImplementedError.super_.call(this);

  this.name = CLASS_NAME;
  this.message = t.apply(this, arguments);
}
util.inherits(NotImplementedError, Error);

module.exports = NotImplementedError;
