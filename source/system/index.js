'use strict';

var EnumerationError = require('./../system/enumeration-error.js');
var NotImplementedError = require('./not-implemented-error.js');
var Utility = require('./utility.js');

/**
 * Contains general components.
 *
 * @namespace bo.system
 *
 * @property {function} EnumerationError - {@link bo.system.EnumerationError Enumeration error}
 *      constructor to create a new error related to an enumeration.
 * @property {function} NotImplementedError - {@link bo.system.NotImplementedError Not implemented error}
 *      constructor to create a new error related to a not implemented function.
 * @property {function} Utility - {@link bo.system.Utility Utility}
 *      function provides static methods for configuration and internationalization.
 */
var index = {
  EnumerationError: EnumerationError,
  NotImplementedError: NotImplementedError,
  Utility: Utility
};

// Immutable object.
Object.freeze(index);

module.exports = index;
