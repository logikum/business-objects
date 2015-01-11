'use strict';

var fs = require('fs');
var path = require('path');
var daoBuilder = require('../data-access/dao-builder.js');
var NoAccessBehavior = require('../rules/no-access-behavior.js');
var ConfigurationError = require('./configuration-error.js');

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

  // Evaluate the data access object builder.
  if (cfg.daoBuilder) {

    if (typeof cfg.daoBuilder !== 'string' && !(cfg.daoBuilder instanceof String))
      throw new ConfigurationError('boString', 'daoBuilder');

    var daoBuilderPath = path.join(cwd, cfg.daoBuilder);
    if (!fs.existsSync(daoBuilderPath) || !fs.statSync(daoBuilderPath).isFile())
      throw new ConfigurationError('boFile', 'daoBuilder', daoBuilderPath);

    var daoBuilderFunction = require(daoBuilderPath);
    if (typeof daoBuilderFunction !== 'function')
      throw new ConfigurationError('boFunction', 'daoBuilder', daoBuilderPath);

    config.daoBuilder = daoBuilderFunction;
  } else {
    config.daoBuilder = daoBuilder;
  }

  // Evaluate the user information reader.
  if (cfg.userReader) {

    if (typeof cfg.userReader !== 'string' && !(cfg.userReader instanceof String))
      throw new ConfigurationError('boString', 'userReader');

    var userReaderPath = path.join(cwd, cfg.userReader);
    if (!fs.existsSync(userReaderPath) || !fs.statSync(userReaderPath).isFile())
      throw new ConfigurationError('boFile', 'userReader', userReaderPath);

    var userReaderFunction = require(userReaderPath);
    if (typeof userReaderFunction !== 'function')
      throw new ConfigurationError('boFunction', 'userReader', userReaderPath);

    config.userReader = userReaderFunction;
  }

  // Evaluate the unauthorized behavior.
  if (cfg.noAccessBehavior !== undefined && cfg.noAccessBehavior !== null) {
    NoAccessBehavior.check(cfg.noAccessBehavior,
      'The value of noAccessBehavior property of BusinessObjects configuration must be a NoAccessBehavior item.');
    config.noAccessBehavior = cfg.noAccessBehavior;
  }

  // Evaluate the path of locale.
  if (cfg.pathOfLocales) {

    if (typeof cfg.pathOfLocales !== 'string' && !(cfg.pathOfLocales instanceof String))
      throw new ConfigurationError('i18nString', 'pathOfLocales');

    var pathOfLocales = path.join(cwd, cfg.pathOfLocales);
    if (!fs.existsSync(pathOfLocales) || !fs.statSync(pathOfLocales).isDirectory())
      throw new ConfigurationError('i18nDirectory', 'pathOfLocales', pathOfLocales);

    config.pathOfLocales = pathOfLocales;
  }

  // Evaluate the locale reader.
  if (cfg.localeReader) {

    if (typeof cfg.localeReader !== 'string' && !(cfg.localeReader instanceof String))
      throw new ConfigurationError('i18nString', 'localeReader');

    var localeReaderPath = path.join(cwd, cfg.localeReader);
    if (!fs.existsSync(localeReaderPath) || !fs.statSync(localeReaderPath).isFile())
      throw new ConfigurationError('i18nFile', 'localeReader', localeReaderPath);

    var localeReaderFunction = require(localeReaderPath);
    if (typeof localeReaderFunction !== 'function')
      throw new ConfigurationError('i18nFunction', 'localeReader', localeReaderPath);

    config.localeReader = localeReaderFunction;
  }
}

Object.freeze(config);

module.exports = config;
