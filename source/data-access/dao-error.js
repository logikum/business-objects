'use strict';

var CLASS_NAME = 'DaoError';

var util = require('util');
var t = require('../locales/i18n-bo.js')(CLASS_NAME);

function DaoError() {
  DaoError.super_.call(this);

  this.name = CLASS_NAME;
  this.message = t.apply(this, arguments);
}
util.inherits(DaoError, Error);

module.exports = DaoError;
