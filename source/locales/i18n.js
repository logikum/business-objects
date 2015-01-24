'use strict';

var fs = require('fs');
var path = require('path');
var util = require('util');
var Utility = require('../shared/utility.js');

var locales = {};
var getCurrentLocale = function () { return 'default'; };
var isInitialized = false;

//region Read locales

// Read business-objects locales.
readLocales('$bo', path.join(process.cwd(), 'source/locales'));

function readProjectLocales (pathOfLocales) {
  // Read default namespace.
  readLocales('$default', pathOfLocales);

  // Read other namespaces.
  fs.readdirSync(pathOfLocales).filter(function (directoryName) {
    return fs.statSync(path.join(pathOfLocales, directoryName)).isDirectory() &&
        path.extname(directoryName) !== '$default' &&
        path.extname(directoryName) !== '$bo';
  }).forEach(function (directoryName) {
    readLocales(directoryName, path.join(pathOfLocales, directoryName));
  });
}

function readLocales (namespace, localePath) {
  locales[namespace] = {};
  fs.readdirSync(localePath).filter(function (fileName) {
    return fs.statSync(path.join(localePath, fileName)).isFile() && path.extname(fileName) === '.json';
  }).forEach(function (fileName) {
    var filePath = path.join(localePath, fileName);
    if (fs.statSync(filePath).isFile())
      locales[namespace][path.basename(fileName, '.json')] = require(filePath);
  });
}

//endregion

//region Custom error

/**
 * @classdesc Represents an internationalization error.
 * @description Creates an internationalization error object.
 *
 * @memberof bo
 * @constructor
 * @param {string} [message] - Human-readable description of the error.
 * @param {...*} [messageParams] - Optional interpolation parameters of the message.
 *
 * @extends {Error}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error Error} for further information.
 */
function I18nError() {
  I18nError.super_.call(this);

  var i18nLocales = new i18n('$bo', 'i18n');

  this.name = 'I18nError';
  this.message = i18nLocales.get.apply(i18nLocales, arguments.length ? arguments : ['default']);
}
util.inherits(I18nError, Error);

//endregion

//region Define message handler

/**
 * @classdesc Provide methods to get localized messages.
 * @description Creates a new message localizer object.
 *
 * @memberof bo
 * @constructor
 * @param {string} [namespace=$default] - The namespace of the messages.
 * @param {string} [keyRoot] - The key root of the messages.
 *
 * @extends {Error}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error Error} for further information.
 *
 * @throws {@link bo.I18nError i18n error}: The namespace must be a string value or null.
 * @throws {@link bo.I18nError i18n error}: The key root must be a string value or null.
 */
var i18n = function (namespace, keyRoot) {

  namespace = Utility.isOptionalString(namespace, 'namespace', I18nError);
  keyRoot = Utility.isOptionalString(keyRoot, 'keyRoot', I18nError);

  this.namespace = namespace || '$default';
  this.keyRoot = keyRoot || '';

  if (this.keyRoot && this.keyRoot.substr(-1) !== '.')
    this.keyRoot += '.';

  // Immutable object.
  Object.freeze(this);
};

/**
 * Reads the localized messages of the user project and the business objects package.
 *
 * @function bo.i18n.initialize
 * @param {string} pathOfLocales - The relative path of the messages of the user project.
 * @param {function} localeReader - A function that returns the current locale.
 */
i18n.initialize = function (pathOfLocales, localeReader) {
  if (isInitialized)
    throw new I18nError('ready');

  if (pathOfLocales) {
    readProjectLocales(
        Utility.getDirectory(pathOfLocales, 'pathOfLocales', I18nError)
    );
  }
  if (localeReader) {
    getCurrentLocale = typeof localeReader === 'function' ?
        localeReader :
        Utility.getFunction(localeReader, 'localeReader', I18nError)
    ;
  }
  isInitialized = true;
};

/**
 * Gets a localized message of a given key.
 *
 * @function bo.i18n#get
 * @param {string} messageKey - The key of the required message.
 * @returns {string} The localized message for the current locale, if not found
 *      then the message for the default locale, otherwise the message key.
 *
 * @throws {@link bo.I18nError i18n error}: The message key must be a non-empty string.
 */
i18n.prototype.get = function (messageKey) {
  var args = Array.prototype.slice.call(arguments);
  args.unshift(this.namespace);
  return this.getWithNs.apply(this, args);
};

/**
 * Gets a localized message of a given key.
 *
 * @function bo.i18n#getWithNs
 * @param {string} namespace - The namespace of the required message.
 * @param {string} messageKey - The key of the required message.
 * @returns {string} The localized message for the current locale, if not found
 *      then the message for the default locale, otherwise the message key.
 *
 * @throws {@link bo.I18nError i18n error}: The namespace must be a non-empty string.
 * @throws {@link bo.I18nError i18n error}: The message key must be a non-empty string.
 */
i18n.prototype.getWithNs = function (namespace, messageKey) {

  namespace = Utility.isMandatoryString(namespace, 'namespace', I18nError);
  messageKey = Utility.isMandatoryString(messageKey, 'messageKey', I18nError);

  var keys = (this.keyRoot + messageKey).split('.');
  var messageArgs = arguments;

  function replacer(match) {
    var index = new Number(match.substr(1, match.length - 2)) + 2;
    var replacement = '';
    if (index < messageArgs.length) {
      var arg = messageArgs[index];
      if (arg !== undefined && arg !== null)
        replacement = typeof arg === 'function' ?
            (arg.name ? arg.name : '<< unknown >>') :
            arg.toString();
    }
    return replacement;
  }

  function readMessage(messages) {
    var base = messages;
    for (var i = 0; i < keys.length; i++) {
      if (!base[keys[i]])
        return false;
      if (i + 1 === keys.length) {
        message = base[keys[i]];
        return true;
      } else
        base = base[keys[i]];
    }
  }

  var ns = locales[namespace];
  var locale = getCurrentLocale();

  var message = messageKey;

  // When namespace is valid...
  if (ns) {
    var found = false;
    // Get message of specific locale.
    if (ns[locale])
      found = readMessage(ns[locale]);
    // Get message of main locale.
    if (!found && l_Main && ns[l_Main]) {
      var l_Main = locale.substr(0, locale.indexOf('-'));
      found = readMessage(ns[l_Main]);
    }
    // Get message of default locale.
    if (!found && ns['default'])
      readMessage(ns['default']);
  }

  // Format message with optional arguments.
  if (arguments.length > 2) {
    message = message.replace(/{\d+}/g, replacer);
  }

  return message;
};

//endregion

module.exports = i18n;
