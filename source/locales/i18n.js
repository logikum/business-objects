'use strict';

var fs = require('fs');
var path = require('path');
var util = require('util');
var Utility = require('../system/utility.js');

var NEUTRAL = 'default';
var NS_ROOT = '$default';
var NS_BO = '$bo';

var locales = {};
var getCurrentLocale = function () { return NEUTRAL; };
var isInitialized = false;

//region Read locales

function readProjectLocales (pathOfLocales) {
  // Read default namespace.
  readLocales(NS_ROOT, pathOfLocales);

  // Read other namespaces.
  fs.readdirSync(pathOfLocales).filter(function (directoryName) {
    return fs.statSync(path.join(pathOfLocales, directoryName)).isDirectory() &&
        path.extname(directoryName) !== NS_ROOT &&
        path.extname(directoryName) !== NS_BO;
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
    //if (fs.statSync(filePath).isFile())
      locales[namespace][path.basename(fileName, '.json')] = require(filePath);
  });
}

// Read business-objects locales.
readLocales(NS_BO, path.join(process.cwd(), 'source/locales'));

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
  Error.call(this);

  var i18nLocales = new i18n('$bo', 'i18n');

  /**
   * The name of the error type.
   * @type {string}
   * @default I18nError
   */
  this.name = this.constructor.name;

  /**
   * Human-readable description of the error.
   * @type {string}
   */
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
 * @throws {@link bo.I18nError i18n error}: The namespace must be a string value or null.
 * @throws {@link bo.I18nError i18n error}: The key root must be a string value or null.
 */
var i18n = function (namespace, keyRoot) {

  namespace = Utility.isOptionalString(namespace, 'namespace', I18nError);
  keyRoot = Utility.isOptionalString(keyRoot, 'keyRoot', I18nError);

  this.namespace = namespace || NS_ROOT;
  this.keyRoot = keyRoot || '';

  if (this.keyRoot && this.keyRoot.substr(-1) !== '.')
    this.keyRoot += '.';

  // Immutable object.
  Object.freeze(this);
};

/**
 * Reads the localized messages of the project.
 *
 * @function bo.i18n.initialize
 * @param {string} pathOfLocales - The relative path of the directory that contains the project messages.
 * @param {function} [getLocale] - A function that returns the current locale.
 *
 * @throws {@link bo.I18nError i18n error}: The path of locales must be a non-empty string.
 * @throws {@link bo.I18nError i18n error}: The path of locales is not a valid directory path.
 * @throws {@link bo.I18nError i18n error}: The locale getter must be a function.
 */
i18n.initialize = function (pathOfLocales, getLocale) {
  if (isInitialized)
    throw new I18nError('ready');

  readProjectLocales(
      Utility.getDirectory(pathOfLocales, 'pathOfLocales', I18nError)
  );

  if (getLocale) {
    if (typeof getLocale === 'function')
      getCurrentLocale = getLocale;
    else
      throw new I18nError('function', 'getLocale');
  }

  isInitialized = true;
};

/* locale*namespace:key1.key2.key3 */
/**
 * Gets a localized message of a given identifier.
 * The message identifier has the pattern: [locale*][namespace:]key1[[.key2]...]
 * Examples:
 * <dl>
 *   <dt>australia</dt>
 *   <dd>Simple key with default namespace and current locale.</dd>
 *   <dt>europe.spain.andalusia</dt>
 *   <dd>Extended key with default namespace and current locale.</dd>
 *   <dt>geography:australia</dt>
 *   <dd>Simple key with specified namespace and current locale.</dd>
 *   <dt>geography:europe.spain.andalusia</dt>
 *   <dd>Extended key with specified namespace and current locale.</dd>
 *   <dt>hu\*australia</dt>
 *   <dd>Simple key with default namespace and specified language.</dd>
 *   <dt>hu-HU\*europe.spain.andalusia</dt>
 *   <dd>Extended key with default namespace and specified language with region.</dd>
 *   <dt>hu\*geography:australia</dt>
 *   <dd>Simple key with specified namespace and specified language.</dd>
 *   <dt>hu-HU\*geography:europe.spain.andalusia</dt>
 *   <dd>Extended key with specified namespace and specified language with region.</dd>
 * </dl>
 * If localizer is created with a namespace and the message identifier omits the namespace,
 * then the localizer namespace will applied. Examples for initial namespace <i>economy</i>:
 * <dl>
 *   <dt>australia</dt>
 *   <dd>It is interpreted as <i>economy:australia</i></dd>
 *   <dt>hu-HU\*europe.spain.andalusia</dt>
 *   <dd>It is interpreted as <i>hu-HU\*economy:europe.spain.andalusia</i></dd>
 *   <dt>geography:australia</dt>
 *   <dd>It remains <i>geography:australia</i></dd>
 *   <dt>hu-HU\*geography:europe.spain.andalusia</dt>
 *   <dd>It remains <i>hu-HU\*geography:europe.spain.andalusia</i></dd>
 * </dl>
 * If localizer is created with a key root and the message identifier omits the namespace,
 * then the key root is inserted before the key part of the specified identifier.
 * Examples for initial key root <i>earth</i>:
 * <dl>
 *   <dt>australia</dt>
 *   <dd>It is interpreted as <i>earth.australia</i></dd>
 *   <dt>hu-HU\*europe.spain.andalusia</dt>
 *   <dd>It is interpreted as <i>hu-HU\*earth.europe.spain.andalusia</i></dd>
 *   <dt>geography:australia</dt>
 *   <dd>It remains <i>geography:australia</i></dd>
 *   <dt>hu-HU\*geography:europe.spain.andalusia</dt>
 *   <dd>It remains <i>hu-HU\*geography:europe.spain.andalusia</i></dd>
 * </dl>
 *
 * @function bo.i18n#get
 * @param {string} messageId - The identifier of the required message.
 * @param {...*} [messageParams] - Optional interpolation parameters of the message.
 * @returns {string} The localized message for the current locale, if not found
 *      then the message for the default locale, otherwise the message key.
 *
 * @throws {@link bo.I18nError i18n error}: The message key must be a non-empty string.
 */
i18n.prototype.get = function (messageId, messageParams) {
  var locale, namespace, messageKey;
  var asterisk = messageId.indexOf('*');
  var colon = messageId.indexOf(':');

  // Determine locale.
  if (asterisk > -1)
    locale = messageId.substr(0, asterisk);
  asterisk++;
  locale = locale || getCurrentLocale() || NEUTRAL;

  // Determine namespace.
  if (colon > -1)
    namespace = messageId.substring(asterisk, colon);
  colon++;
  namespace = namespace || this.namespace;

  // Determine message key.
  messageKey = messageId.substr(Math.max(asterisk, colon));
  if (!colon)
    messageKey = this.keyRoot + messageKey;

  var keys = messageKey.split('.').filter(function (key) {
    return key.trim().length > 0;
  });
  if (!keys.length)
    throw new I18nError('messageId');

  // If message is not found then the identifier is returned.
  var message = messageId;
  var found = false;
  var messageArgs = arguments;

  // Replace message parameters with passed arguments.
  function replacer(match) {
    var index = new Number(match.substr(1, match.length - 2)) + 1;
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

  // Find the message in the tree.
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

  // Use the required message set.
  var ns = locales[namespace];

  // When namespace is valid...
  if (ns) {
    // Get message of specific locale.
    if (ns[locale])
      found = readMessage(ns[locale]);
    // Get message of general locale.
    if (!found) {
      var general = locale.substr(0, locale.lastIndexOf('-'));
      if (general && ns[general])
        found = readMessage(ns[general]);
    }
    // Get message of default locale.
    if (!found && locale !== NEUTRAL && ns[NEUTRAL])
      readMessage(ns[NEUTRAL]);
  }

  // Format message with optional arguments.
  if (found && messageArgs.length > 1) {
    message = message.replace(/{\d+}/g, replacer);
  }

  return message;
};

//endregion

module.exports = i18n;
