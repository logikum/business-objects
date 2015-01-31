'use strict';

var fs = require('fs');
var path = require('path');
var ConnectionManagerBase = require('../data-access/connection-manager-base.js');
var daoBuilder = require('../data-access/dao-builder.js');
var NoAccessBehavior = require('../rules/no-access-behavior.js');
var Utility = require('./utility.js');
var ConfigurationError = require('./configuration-error.js');
var UserInfo = require('./user-info.js');

// Define the possible configuration files.
var options = [
  '/business-objects-config.js',
  '/business-objects-config.json',
  '/config/business-objects.js',
  '/config/business-objects.json'
];
var cwd = process.cwd();
var config = {};
var cfg;

// Read first configuration file found.
for (var i = 0; i < options.length; i++) {
  var cfgPath = path.join(cwd, options[i]);
  if (fs.existsSync(cfgPath)) {
    cfg = require(cfgPath);
    break;
  }
}

// Test if configuration file was found.
if (cfg) {

  // Evaluate the connection manager.
  if (cfg.connectionManager) {
    var cmConstructor = Utility.getFunction(cfg.connectionManager, 'connectionManager', ConfigurationError);
    config.connectionManager = new cmConstructor();
    if (!(config.connectionManager instanceof ConnectionManagerBase))
      throw new ConfigurationError('wrongConMan');
  } else
    throw new ConfigurationError('noConMan');

  // Evaluate the data access object builder.
  if (cfg.daoBuilder) {
    config.daoBuilder = Utility.getFunction(cfg.daoBuilder, 'daoBuilder', ConfigurationError);
  } else {
    config.daoBuilder = daoBuilder;
  }

  // Evaluate the user information reader.
  var fnUserReader = null;
  if (cfg.userReader) {
    fnUserReader = Utility.getFunction(cfg.userReader, 'userReader', ConfigurationError);
  }
  config.getUser = function () {
    var user = null;
    if (fnUserReader) {
      user = fnUserReader();
      if (user === undefined)
        user = null;
      else if (user !== null && !(user instanceof UserInfo) && user.super_ !== UserInfo)
        throw new ConfigurationError('userReader');
    }
    return user;
  };

  // Evaluate the locale reader.
  var fnGetLocale = null;
  if (cfg.localeReader) {
    fnGetLocale = Utility.getFunction(cfg.localeReader, 'localeReader', ConfigurationError);
  }
  config.getLocale = function () {
    var locale = '';
    if (fnGetLocale) {
      locale = fnGetLocale() || '';
      if (typeof locale !== 'string' && !(locale instanceof String))
        throw new ConfigurationError('localeReader');
    }
    return locale;
  };

  // Evaluate the path of locale.
  if (cfg.pathOfLocales) {
    config.pathOfLocales = Utility.getDirectory(cfg.pathOfLocales, 'pathOfLocales', ConfigurationError);
  }

  // Evaluate the unauthorized behavior.
  if (cfg.noAccessBehavior !== undefined && cfg.noAccessBehavior !== null) {
    config.noAccessBehavior = Utility.isEnumMember(
        cfg.noAccessBehavior, NoAccessBehavior, 'noAccessBehavior', ConfigurationError
    );
  }
}

Object.freeze(config);

/**
 * Configuration for business objects.
 * @namespace bo.configuration
 * @property {bo.dataAccess.ConnectionManagerBase} connectionManager - Connection manager instance.
 * @property {function} daoBuilder - Factory method to create data access objects.
 * @property {function} getUser - Returns the current user.
 * @property {function} getLocale - Returns the current locale.
 * @property {string} pathOfLocales - The full path of the directory containing project locales.
 * @property {bo.rules.NoAccessBehavior} noAccessBehavior - The default behavior for unauthorized operations.
 */
module.exports = config;
