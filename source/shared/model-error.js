'use strict';

var CLASS_NAME = 'ModelError';

var util = require('util');
var t = require('../locales/i18n-bo.js')(CLASS_NAME);

function ModelError(message) {
  ModelError.super_.call(this);

  this.name = CLASS_NAME;

  this.message = t.apply(this, message ? arguments : ['default']);
}
util.inherits(ModelError, Error);

module.exports = ModelError;
