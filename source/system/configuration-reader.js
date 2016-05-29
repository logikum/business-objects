'use strict';

//region Imports

const fs = require( 'fs' );
const path = require( 'path' );
const ConfigurationError = require( './configuration-error.js' );
const ConnectionManagerBase = require( '../data-access/connection-manager-base.js' );
const daoBuilder = require( '../data-access/dao-builder.js' );
const NoAccessBehavior = require( '../rules/no-access-behavior.js' );
const UserInfo = require( './user-info.js' );
const Utility = require( './utility.js' );

//endregion

//region Private variables

let _isInitialized = false;
let _connectionManager = null;
let _daoBuilder = daoBuilder;
let _userReader = null;
let _getLocale = null;
let _pathOfLocales = null;
let _noAccessBehavior = NoAccessBehavior.throwError;

//endregion

/**
 * The configuration of business objects.
 *
 * @name bo.system.configuration
 */
class Configuration {

  /**
   * The connection manager instance.
   * It must be set via {@link bo.initialize} or {@link bo.configuration.initialize}.
   * @member {bo.dataAccess.ConnectionManagerBase} bo.system.configuration.connectionManager
   * @readonly
   * @static
   */
  static get connectionManager() {
    return _connectionManager;
  }

  /**
   * Factory method to create data access objects.
   * The default method is {@link bo.dataAccess.daoBuilder}.
   * @member {external.daoBuilder} bo.system.configuration.daoBuilder
   * @readonly
   * @static
   * @default bo.dataAccess.daoBuilder
   */
  static get daoBuilder() {
    return _daoBuilder;
  }

  /**
   * Returns the current user. The default method returns null, i.e. anonymous user is assumed.
   *
   * @function bo.system.configuration.getUser
   * @returns {bo.system.UserInfo} The current user.
   *
   * @throws {@link bo.system.ConfigurationError Configuration error}:
   *      The function defined by the userReader property of business objects' configuration
   *      must return a UserInfo object.
   */
  static getUser() {

    let user = null;
    if (_userReader) {
      user = _userReader();
      if (user === undefined)
        user = null;
      else if (user !== null && !(user instanceof UserInfo) && user.super_ !== UserInfo)
        throw new ConfigurationError( 'userReader' );
    }
    return user;
  }

  /**
   * Returns the current locale. The default method returns an empty string,
   * i.e. the business objects will use the default messages.
   *
   * @function bo.system.configuration.getLocale
   * @returns {string} The current locale.
   *
   * @throws {@link bo.system.ConfigurationError Configuration error}:
   *      The function defined by the localeReader property of business objects' configuration
   *      must return a string value.
   */
  static getLocale() {

    let locale = '';
    if (_getLocale) {
      locale = _getLocale() || '';
      if (typeof locale !== 'string' && !(locale instanceof String))
        throw new ConfigurationError( 'localeReader' );
    }
    return locale;
  }

  /**
   * The relative path of the directory containing project locales. If not supplied,
   * the business objects cannot interpret the first message argument as the message key,
   * i.e. the first message argument must be the message text.
   * @member {string} bo.system.configuration.pathOfLocales
   * @readonly
   * @static
   */
  static get pathOfLocales() {
    return _pathOfLocales;
  }

  /**
   * The default behavior for unauthorized operations.
   * The default value is {@link bo.rules.NoAccessBehavior#throwError}.
   * @member {bo.rules.NoAccessBehavior} bo.system.configuration.noAccessBehavior
   * @readonly
   * @static
   * @default bo.rules.NoAccessBehavior#throwError
   */
  static get noAccessBehavior() {
    return _noAccessBehavior;
  }

  /**
   * Reads the configuration of business objects.
   *
   * @function bo.system.configuration.initialize
   * @param {string} cfgPath - The path of the configuration file.
   *
   * @throws {@link bo.system.ConfigurationError Configuration error}:
   *      The configuration is already initialized.
   * @throws {@link bo.system.ConfigurationError Configuration error}:
   *      The connection manager is required.
   * @throws {@link bo.system.ConfigurationError Configuration error}:
   *      The connection manager must inherit ConnectionManagerBase type.
   */
  static initialize( cfgPath ) {
    let cfg = null;

    if (_isInitialized)
      throw new ConfigurationError( 'ready' );

    // Read the configuration file.
    const fullPath = path.join( process.cwd(), cfgPath );
    if (fs.existsSync( fullPath ))
      cfg = require( fullPath );

    // Test if configuration file was found.
    if (cfg) {

      // Evaluate the connection manager.
      if (cfg.connectionManager) {
        const cmConstructor = Utility.getFunction( cfg.connectionManager, 'connectionManager', ConfigurationError );
        _connectionManager = new cmConstructor();
        if (!(_connectionManager instanceof ConnectionManagerBase))
          throw new ConfigurationError( 'wrongConMan' );
      } else
        throw new ConfigurationError( 'noConMan' );

      // Evaluate the data access object builder.
      if (cfg.daoBuilder) {
        _daoBuilder = Utility.getFunction( cfg.daoBuilder, 'daoBuilder', ConfigurationError );
      }

      // Evaluate the user information reader.
      if (cfg.userReader) {
        _userReader = Utility.getFunction( cfg.userReader, 'userReader', ConfigurationError );
      }

      // Evaluate the locale reader.
      if (cfg.localeReader) {
        _getLocale = Utility.getFunction( cfg.localeReader, 'localeReader', ConfigurationError );
      }

      // Evaluate the path of locale.
      if (cfg.pathOfLocales) {
        Utility.getDirectory( cfg.pathOfLocales, 'pathOfLocales', ConfigurationError );
        _pathOfLocales = cfg.pathOfLocales;
      }

      // Evaluate the unauthorized behavior.
      if (cfg.noAccessBehavior !== undefined && cfg.noAccessBehavior !== null) {
        _noAccessBehavior = Utility.isEnumMember(
          cfg.noAccessBehavior, NoAccessBehavior, 'noAccessBehavior', ConfigurationError
        );
      }
    }
    _isInitialized = true;
  }
}

Object.freeze( Configuration );

module.exports = Configuration;
