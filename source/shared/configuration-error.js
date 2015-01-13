'use strict';

var util = require('util');
var t = require('../locales/i18n-bo.js')('ConfigurationError');

function ConfigurationError() {
  ConfigurationError.super_.call(this);

  this.name = 'ConfigurationError';
  this.message = t.apply(this, arguments);
}
util.inherits(ConfigurationError, Error);

module.exports = ConfigurationError;
