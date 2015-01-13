'use strict';

var util = require('util');
var t = require('../locales/i18n-bo.js')('AuthorizationError');

function AuthorizationError() {
  AuthorizationError.super_.call(this);

  this.name = 'AuthorizationError';
  this.message = t.apply(this, arguments);
}
util.inherits(AuthorizationError, Error);

module.exports = AuthorizationError;
