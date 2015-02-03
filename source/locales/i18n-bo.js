'use strict';

var i18n = require('./i18n.js');

/**
 * Get a message localizer function initialized for the messages of
 * the business objects package, i.e. the namespace is '$bo'.
 *
 * @function internal.i18nBO
 * @param {string} [keyRoot] - The key root of the messages.
 * @returns {Function} The message localizer function.
 */
var getLocalizer = function (keyRoot) {
  var boLocales = new i18n('$bo', keyRoot);

  return function () {
    return boLocales.get.apply(boLocales, arguments.length ? arguments : ['default']);
  }
};

module.exports = getLocalizer;
