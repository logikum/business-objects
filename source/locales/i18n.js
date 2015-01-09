'use strict';

var fs = require('fs');
var path = require('path');
var config = require('./config-reader.js');

var locales = {};

//region Read all locales

// Read business-objects locales.
readLocales('$bo', path.join(process.cwd(), 'source/locales'));

// Read project locales.
if (config.pathOfLocales) {
  // Read default namespace.
  readLocales('$default', config.pathOfLocales);

  // Read other namespaces.
  fs.readdirSync(config.pathOfLocales).filter(function (directoryName) {
    return fs.statSync(path.join(config.pathOfLocales, directoryName)).isDirectory() &&
        path.extname(directoryName) !== '$default' &&
        path.extname(directoryName) !== '$bo';
  }).forEach(function (directoryName) {
    //var ns = directoryName.substr(directoryName.lastIndexOf(path.sep) + 1);
    readLocales(directoryName, path.join(config.pathOfLocales, directoryName));
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

//region Define message handler

var i18n = function (namespace, keyRoot) {

  if (namespace && typeof namespace !== 'string')
    throw new Error('The namespace argument of i18n constructor must be a string.');
  if (keyRoot && typeof keyRoot !== 'string')
    throw new Error('The keyRoot argument of i18n constructor must be a string.');

  this.namespace = namespace || '$default';
  this.keyRoot = keyRoot || '';

  if (this.keyRoot && this.keyRoot.substr(-1) !== '.')
    this.keyRoot += '.';

  // Immutable object.
  Object.freeze(this);
};

i18n.prototype.get = function (messageKey) {
  var args = Array.prototype.slice.call(arguments);
  args.unshift(this.namespace);
  return this.getWithNs.apply(this, args);
};

i18n.prototype.getWithNs = function (namespace, messageKey) {

  if (typeof namespace !== 'string' || namespace.length === 0)
    throw new Error('The namespace argument of i18n.get method must be a non-empty string.');
  if (typeof messageKey !== 'string' || messageKey.length === 0)
    throw new Error('The messageKey argument of i18n.get method must be a non-empty string.');

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
  var locale = config.localeReader();

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
