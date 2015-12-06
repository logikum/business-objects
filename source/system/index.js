'use strict';

var ArgumentError = require('./argument-error.js');
var EnumerationError = require('./enumeration-error.js');
var NotImplementedError = require('./not-implemented-error.js');

var Enumeration = require('./enumeration.js');
var Argument = require('./argument-check.js');
var UserInfo = require('./user-info.js');
var Utility = require('./utility.js');

/**
 * Contains general components.
 *
 * @namespace bo.system
 *
 * @property {function} ArgumentError - {@link bo.system.ArgumentError Argument error}
 *      constructor to create a new error related to an argument.
 * @property {function} EnumerationError - {@link bo.system.EnumerationError Enumeration error}
 *      constructor to create a new error related to an enumeration.
 * @property {function} NotImplementedError - {@link bo.system.NotImplementedError Not implemented error}
 *      constructor to create a new error related to a not implemented function.
 *
 * @property {function} Enumeration - {@link bo.system.Enumeration Enumeration}
 *      constructor to create new enumeration.
 * @property {object} Argument - {@link bo.system.Argument Argument verification}
 *      namespace provides methods to check arguments.
 * @property {function} UserInfo - {@link bo.system.UserInfo User data}
 *      constructor to create new base object for user information.
 * @property {function} Utility - {@link bo.system.Utility Utility}
 *      function provides static methods for configuration and internationalization.
 */
var index = {
  ArgumentError: ArgumentError,
  EnumerationError: EnumerationError,
  NotImplementedError: NotImplementedError,

  Enumeration: Enumeration,
  Argument: Argument,
  UserInfo: UserInfo,
  Utility: Utility
};

// Immutable object.
Object.freeze(index);

module.exports = index;
