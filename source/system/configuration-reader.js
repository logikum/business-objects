'use strict';

var fs = require('fs');
var path = require('path');
var ConfigurationError = require('./configuration-error.js');
var ConnectionManagerBase = require('../data-access/connection-manager-base.js');
var daoBuilder = require('../data-access/dao-builder.js');
var NoAccessBehavior = require('../rules/no-access-behavior.js');
var UserInfo = require('./user-info.js');
var Utility = require('./utility.js');

var isInitialized = false;
var fnUserReader = null;
var fnGetLocale = null;

function getUser () {
  var user = null;
  if (fnUserReader) {
    user = fnUserReader();
    if (user === undefined)
      user = null;
    else if (user !== null && !(user instanceof UserInfo) && user.super_ !== UserInfo)
      throw new ConfigurationError('userReader');
  }
  return user;
}

function getLocale () {
  var locale = '';
  if (fnGetLocale) {
    locale = fnGetLocale() || '';
    if (typeof locale !== 'string' && !(locale instanceof String))
      throw new ConfigurationError('localeReader');
  }
  return locale;
}

function initialize (cfgPath) {
  var cfg = null;

  // Read the configuration file.
  var fullPath = path.join(process.cwd(), cfgPath);
  if (fs.existsSync(fullPath))
    cfg = require(fullPath);

  // Test if configuration file was found.
  if (cfg) {

    // Evaluate the connection manager.
    if (cfg.connectionManager) {
      var cmConstructor = Utility.getFunction(cfg.connectionManager, 'connectionManager', ConfigurationError);
      this.connectionManager = new cmConstructor();
      if (!(this.connectionManager instanceof ConnectionManagerBase))
        throw new ConfigurationError('wrongConMan');
    } else
      throw new ConfigurationError('noConMan');

    // Evaluate the data access object builder.
    if (cfg.daoBuilder) {
      this.daoBuilder = Utility.getFunction(cfg.daoBuilder, 'daoBuilder', ConfigurationError);
    }

    // Evaluate the user information reader.
    if (cfg.userReader) {
      fnUserReader = Utility.getFunction(cfg.userReader, 'userReader', ConfigurationError);
    }

    // Evaluate the locale reader.
    if (cfg.localeReader) {
      fnGetLocale = Utility.getFunction(cfg.localeReader, 'localeReader', ConfigurationError);
    }

    // Evaluate the path of locale.
    if (cfg.pathOfLocales) {
      Utility.getDirectory(cfg.pathOfLocales, 'pathOfLocales', ConfigurationError);
      this.pathOfLocales = cfg.pathOfLocales;
    }

    // Evaluate the unauthorized behavior.
    if (cfg.noAccessBehavior !== undefined && cfg.noAccessBehavior !== null) {
      this.noAccessBehavior = Utility.isEnumMember(
          cfg.noAccessBehavior, NoAccessBehavior, 'noAccessBehavior', ConfigurationError
      );
    }
  }
}

/**
 * The configuration object for business objects.
 *
 * @name bo.system~configuration
 * @property {bo.dataAccess.ConnectionManagerBase} connectionManager -
 *    The connection manager instance. It must be set via {@link bo.initialize} or
 *    {@link bo.configuration.initialize}.
 * @property {external.daoBuilder} daoBuilder -
 *    Factory method to create data access objects. The default method is
 *    {@link bo.dataAccess.daoBuilder}.
 * @property {external.getUser} getUser -
 *    Returns the current user. The default method returns null, i.e. anonymous user is assumed.
 * @property {external.getLocale} getLocale -
 *    Returns the current locale. The default method returns an empty string,
 *    i.e. the business objects will use the default messages.
 * @property {string} [pathOfLocales] -
 *    The relative path of the directory containing project locales. If not supplied,
 *    the business objects cannot interpret the first message argument as the message key,
 *    i.e. the first message argument must be the message text.
 * @property {bo.rules.NoAccessBehavior} noAccessBehavior -
 *    The default behavior for unauthorized operations.
 *    The default value is {@link bo.rules.NoAccessBehavior#throwError}.
 * @property {internal~initializeCfg} initialize -
 *    Reads the configuration of business objects.
 */
var configuration = {
  connectionManager: null,
  daoBuilder: daoBuilder,
  getUser: getUser,
  getLocale: getLocale,
  pathOfLocales: null,
  noAccessBehavior: NoAccessBehavior.throwError,

  initialize: function (cfgPath) {
    if (isInitialized)
      throw new ConfigurationError('ready');

    initialize.call(this, cfgPath);
    isInitialized = true;

    Object.freeze(this);
  }
};

module.exports = configuration;
