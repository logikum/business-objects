'use strict';

var fs = require('fs');
var path = require('path');

// Define the possible configuration files.
var options = [
  '/locales-config.js',
  '/locales-config.json',
  '/config/locales.js',
  '/config/locales.json'
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

  // Evaluate the locale reader.
  if (cfg.localeReader) {

    if (typeof cfg.localeReader !== 'string')
      throw new Error('The value of localeReader property of BusinessObjects configuration must be a string.');

    var localeReaderPath = path.join(cwd, cfg.localeReader);
    if (!fs.existsSync(localeReaderPath) || !fs.statSync(localeReaderPath).isFile())
      throw new Error('The value of localeReader property of BusinessObjects configuration is not a valid file path: ' + localeReaderPath);

    var localeReaderFunction = require(localeReaderPath);
    if (typeof localeReaderFunction !== 'function')
      throw new Error('The file defined by the localeReader property of BusinessObjects configuration must return a function: ' + localeReaderPath);

    config.localeReader = localeReaderFunction;
  }

  // Evaluate the path of locale.
  if (cfg.pathOfLocales) {

    if (typeof cfg.pathOfLocales !== 'string')
      throw new Error('The value of pathOfLocales property of BusinessObjects configuration must be a string.');

    var pathOfLocales = path.join(cwd, cfg.pathOfLocales);
    if (!fs.existsSync(pathOfLocales) || !fs.statSync(pathOfLocales).isDirectory())
      throw new Error('The value of pathOfLocales property of BusinessObjects configuration is not a valid directory path: ' + pathOfLocales);

    config.pathOfLocales = pathOfLocales;
  }
}

// Immutable object.
Object.freeze(config);

module.exports = config;
