/**
 * Argument error module.
 * @module shared/argument-error
 */
'use strict';

var util = require('util');
var t = require('../locales/i18n-bo.js')('ArgumentError');

function ArgumentError() {
  ArgumentError.super_.call(this);

  this.name = 'ArgumentError';
  this.message = t.apply(this, arguments);
}
util.inherits(ArgumentError, Error);

module.exports = ArgumentError;
