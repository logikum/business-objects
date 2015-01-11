'use strict';

var CLASS_NAME = 'ConfigurationError';

var util = require('util');
var t = require('../locales/i18n-bo.js')(CLASS_NAME);

function ConfigurationError() {
  ConfigurationError.super_.call(this);

  this.name = CLASS_NAME;
  this.message = t.apply(this, arguments);
}
util.inherits(ConfigurationError, Error);

module.exports = ConfigurationError;
