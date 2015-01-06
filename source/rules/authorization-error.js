'use strict';

var CLASS_NAME = 'AuthorizationError';

var util = require('util');
var t = require('../locales/i18n-bo.js')(CLASS_NAME);

function AuthorizationError(message) {
  AuthorizationError.super_.call(this);

  this.name = CLASS_NAME;

  this.message = t.apply(this, message ? arguments : ['default']);
}
util.inherits(AuthorizationError, Error);

module.exports = AuthorizationError;
