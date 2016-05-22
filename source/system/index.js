'use strict';

//region Imports

const Argument = require( './argument-check.js' );
const Enumeration = require( './enumeration.js' );
const UserInfo = require( './user-info.js' );
const Utility = require( './utility.js' );

const ArgumentError = require( './argument-error.js' );
const ComposerError = require( './composer-error.js' );
const ConfigurationError = require( './configuration-error.js' );
const ConfigurationReader = require( './configuration-reader.js' );
const ConstructorError = require( './constructor-error.js' );
const EnumerationError = require( './enumeration-error.js' );
const MethodError = require( './method-error.js' );
const NotImplementedError = require( './not-implemented-error.js' );
const PropertyError = require( './property-error.js' );

//endregion

/**
 * Contains general components.
 *
 * @namespace bo.system
 *
 * @property {object} Argument - {@link bo.system.Argument Argument verification}
 *      namespace provides methods to check arguments.
 * @property {function} Enumeration - {@link bo.system.Enumeration Enumeration}
 *      constructor to create new enumeration.
 * @property {function} UserInfo - {@link bo.system.UserInfo User data}
 *      constructor to create new base object for user information.
 * @property {function} Utility - {@link bo.system.Utility Utility}
 *      function provides static methods for configuration and internationalization.
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
 * @property {function} EnumerationError - {@link bo.system.EnumerationError Enumeration error}
 *      constructor to create a new error related to an enumeration.
 * @property {function} MethodError - {@link bo.system.MethodError Method error}
 *      constructor to create a new error related to a method argument.
 * @property {function} NotImplementedError - {@link bo.system.NotImplementedError Not implemented error}
 *      constructor to create a new error related to a not implemented function.
 * @property {function} PropertyError - {@link bo.system.PropertyError Property error}
 *      constructor to create a new error related to a property argument.
 */
const index = {
  Argument: Argument,
  Enumeration: Enumeration,
  UserInfo: UserInfo,
  Utility: Utility,
  
  ArgumentError: ArgumentError,
  ComposerError: ComposerError,
  ConfigurationError: ConfigurationError,
  ConfigurationReader: ConfigurationReader,
  ConstructorError: ConstructorError,
  EnumerationError: EnumerationError,
  MethodError: MethodError,
  NotImplementedError: NotImplementedError,
  PropertyError: PropertyError
};

// Immutable object.
Object.freeze( index );

module.exports = index;
