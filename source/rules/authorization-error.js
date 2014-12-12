'use strict';

var util = require('util');

function AuthorizationError(message) {
  AuthorizationError.super_.call(this);

  this.name = 'AuthorizationError';

  this.message = message || 'The user has no permission to execute the action.';
}
util.inherits(AuthorizationError, Error);

module.exports = AuthorizationError;
