'use strict';

var NotImplementedError = require('./not-implemented-error.js');

/**
 * Contains general components.
 *
 * @namespace bo.system
 *
 * @property {function} NotImplementedError - {@link bo.system.NotImplementedError Not implemented error}
 *      constructor to create a new error related to a not implemented function.
 */
var index = {
  NotImplementedError: NotImplementedError
};

// Immutable object.
Object.freeze(index);

module.exports = index;
