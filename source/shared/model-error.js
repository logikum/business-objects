'use strict';

var util = require('util');
var t = require('../locales/i18n-bo.js')('ModelError');

function ModelError(message) {
  ModelError.super_.call(this);

  this.name = 'ModelError';

  this.message = t.apply(this, message ? arguments : ['default']);
}
util.inherits(ModelError, Error);

module.exports = ModelError;
