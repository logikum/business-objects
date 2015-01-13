/**
 * Not implemented error module.
 * @module shared/not-implemented-error
 */
'use strict';

var util = require('util');
var t = require('../locales/i18n-bo.js')('NotImplementedError');

function NotImplementedError() {
  NotImplementedError.super_.call(this);

  this.name = 'NotImplementedError';
  this.message = t.apply(this, arguments);
}
util.inherits(NotImplementedError, Error);

module.exports = NotImplementedError;
