'use strict';

var util = require('util');

function ModelError(message) {
  ModelError.super_.call(this);

  this.name = 'ModelError';

  this.message = message || 'The model has an error.';
}
util.inherits(ModelError, Error);

module.exports = ModelError;
