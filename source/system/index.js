'use strict';

var NotImplementedError = require('./not-implemented-error.js');
var Utility = require('./utility.js');

/**
 * Contains general components.
 *
 * @namespace bo.system
 *
 * @property {function} NotImplementedError - {@link bo.system.NotImplementedError Not implemented error}
 *      constructor to create a new error related to a not implemented function.
 * @property {function} Utility - {@link bo.system.Utility Utility}
 *      function provides static methods for configuration and internationalization.
 */
var index = {
  NotImplementedError: NotImplementedError,
  Utility: Utility
};

// Immutable object.
Object.freeze(index);

module.exports = index;
