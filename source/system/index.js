'use strict';

const ArgumentError = require( './argument-error.js' );
const ComposerError = require( './composer-error.js' );
const ConfigurationError = require( './configuration-error.js' );
const ConfigurationReader = require( './configuration-reader.js' );
const ConstructorError = require( './constructor-error.js' );
const MethodError = require( './method-error.js' );
const PropertyError = require( './property-error.js' );
const EnumerationError = require( './enumeration-error.js' );
const NotImplementedError = require( './not-implemented-error.js' );

const Enumeration = require( './enumeration.js' );
const Argument = require( './argument-check.js' );
const UserInfo = require( './user-info.js' );
const Utility = require( './utility.js' );

/**
 * Contains general components.
 *
 * @namespace bo.system
 *
 * @property {function} ArgumentError - {@link bo.system.ArgumentError Argument error}
 *      constructor to create a new error related to an argument.
 * @property {function} ComposerError - {@link bo.system.ComposerError Composer error}
 *      constructor to create a new error related to model composer.
 * @property {function} ConfigurationError - {@link bo.system.ConfigurationError Configuration error}
 *      constructor to create a new error related to configuration.
 * @property {function} ConfigurationReader - {@link bo.system.ConfigurationReader Configuration reader}
 *      object provides methods and properties to access the business objects' configuration.
 * @property {function} ConstructorError - {@link bo.system.ConstructorError Constructor error}
 *      constructor to create a new error related to a constructor argument.
 * @property {function} MethodError - {@link bo.system.MethodError Method error}
 *      constructor to create a new error related to a method argument.
 * @property {function} PropertyError - {@link bo.system.PropertyError Property error}
 *      constructor to create a new error related to a property argument.
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
const index = {
  ArgumentError: ArgumentError,
  ComposerError: ComposerError,
  ConfigurationError: ConfigurationError,
  ConfigurationReader: ConfigurationReader,
  ConstructorError: ConstructorError,
  MethodError: MethodError,
  PropertyError: PropertyError,
  EnumerationError: EnumerationError,
  NotImplementedError: NotImplementedError,

  Enumeration: Enumeration,
  Argument: Argument,
  UserInfo: UserInfo,
  Utility: Utility
};

// Immutable object.
Object.freeze( index );

module.exports = index;
