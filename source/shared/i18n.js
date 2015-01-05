'use strict';

var fs = require('fs');
var path = require('path');
var config = require('./config-reader.js');
var ensureArgument = require('./ensure-argument.js');

var locales = {};

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

// Define message handler.
var i18n = function (namespace) {
  this.namespace = ensureArgument.isMandatoryString(namespace || '$default',
      'The namespace argument of i18n constructor must be a non-empty string.');

  Object.freeze(this);
};

i18n.prototype.get = function (messageKey) {
  var args = Array.prototype.slice.call(arguments);
  args.unshift(this.namespace);
  return this.getWithNs.apply(this, args);
};

i18n.prototype.getWithNs = function (namespace, messageKey) {

  namespace = ensureArgument.isMandatoryString(namespace,
      'The namespace argument of i18n.get method must be a non-empty string.');
  messageKey = ensureArgument.isMandatoryString(messageKey,
      'The messageKey argument of i18n.get method must be a non-empty string.');
  var messageArgs = arguments;

  function replacer(match, p1, p2, p3, offset, string) {
    var index = new Number(match.substr(1, match.length - 2)) + 2;
    var replacement = '';
    if (index < messageArgs.length) {
      var arg = messageArgs[index];
      if (arg !== undefined && arg !== null)
        replacement = arg.toString();
    }
    return replacement;
  }

  var ns = locales[namespace];
  var locale = config.localeReader();
  var l_Main = locale.substr(0, locale.indexOf('-'));

  var message = messageKey;

  // When namespace is valid...
  if (ns) {
    // Get message of specific locale.
    if (ns[locale] && ns[locale][messageKey])
      message = ns[locale][messageKey];
    // Get message of main locale.
    else if (l_Main && ns[l_Main] && ns[l_Main][messageKey])
      message = ns[l_Main][messageKey];
    // Get message of default locale.
    else if (ns['default'] && ns['default'][messageKey])
      message = ns['default'][messageKey];
  }

  // Format message with optional arguments.
  if (arguments.length > 2) {
    message = message.replace(/{\d+}/g, replacer);
  }

  return message;
};

module.exports = i18n;
