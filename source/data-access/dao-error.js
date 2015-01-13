/**
 * Data access error module.
 * @module data-access/dao-error
 */
'use strict';

var util = require('util');
var t = require('../locales/i18n-bo.js')('DaoError');

function DaoError() {
  DaoError.super_.call(this);

  this.name = 'DaoError';
  this.message = t.apply(this, arguments);
}
util.inherits(DaoError, Error);

module.exports = DaoError;
