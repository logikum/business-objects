'use strict';

var fs = require('fs');
var path = require('path');

/**
 * @classdesc Provides utility methods for configuration and internationalization.
 * @description Creates a new utility object.
 *
 * @memberof bo.shared
 * @constructor
 */
var Utility = function () {};

/**
 * Gets a function read from a file.
 *
 * @function bo.shared.Utility.getFunction
 * @static
 * @param {string} relativePath - The relative path of the file to read.
 * @param {string} name - The name of the configuration item.
 * @param {error} errorType - The type of the error to throw in case of failure.
 * @returns {function} The required function.
 *
 * @throws {@link bo.shared.ConfigurationError Configuration} {@link bo.locales.I18nError I18n} error:
 *    The property value of business objects' configuration must be a string.
 * @throws {@link bo.shared.ConfigurationError Configuration} {@link bo.locales.I18nError I18n} error:
 *    The property value of business objects' configuration is not a valid file path.
 * @throws {@link bo.shared.ConfigurationError Configuration} {@link bo.locales.I18nError I18n} error:
 *    The file defined by the property of business objects' configuration must return a function.
 */
Utility.getFunction = function (relativePath, name, errorType) {

  if (typeof relativePath !== 'string' && !(relativePath instanceof String))
    throw new errorType('string', name);

  var fullPath = path.join(process.cwd(), relativePath);
  if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isFile())
    throw new errorType('file', name, fullPath);

  var requiredFunction = require(fullPath);
  if (typeof requiredFunction !== 'function')
    throw new errorType('function', name, fullPath);

  return requiredFunction;
};

/**
 * Gets the full path of a directory.
 *
 * @function bo.shared.Utility.getDirectory
 * @static
 * @param {string} relativePath - The relative path of the directory.
 * @param {string} name - The name of the configuration item.
 * @param {error} errorType - The type of the error to throw in case of failure.
 * @returns {string} The full path of a directory.
 *
 * @throws {@link bo.shared.ConfigurationError Configuration} {@link bo.locales.I18nError I18n} error:
 *    The property value of business objects' configuration must be a string.
 * @throws {@link bo.shared.ConfigurationError Configuration} {@link bo.locales.I18nError I18n} error:
 *    The property value of business objects' configuration is not a valid directory path.
 */
Utility.getDirectory = function (relativePath, name, errorType) {

  if (typeof relativePath !== 'string' && !(relativePath instanceof String))
    throw new errorType('string', name);

  var fullPath = path.join(process.cwd(), relativePath);
  if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isDirectory())
    throw new errorType('directory', name, fullPath);

  return fullPath;
};

/**
 * Checks if value is member of a given enumeration.
 *
 * @function bo.shared.Utility.isEnumMember
 * @param {number} value - The value to check.
 * @param {constructor} enumType - The type of the enumeration.
 * @param {string} name - The name of the configuration item.
 * @param {error} errorType - The type of the error to throw in case of failure.
 * @returns {number} The checked value.
 *
 * @throws {@link bo.shared.ConfigurationError Configuration error}: Type is not an enumeration type.
 * @throws {@link bo.shared.ConfigurationError Configuration error}: The argument must be an enumeration type item.
 */
Utility.isEnumMember = function (value, enumType, name, errorType) {

  if (!(enumType && enumType.hasMember && enumType.constructor &&
      enumType.constructor.super_ && enumType.constructor.super_.name === 'Enumeration'))
    throw new errorType('enumType', enumType);

  if (!enumType.hasMember(value))
    throw new errorType('enumMember', name, enumType);

  return value;
};

/**
 * Checks if value is a string or null.
 *
 * @function bo.shared.Utility.isOptionalString
 * @param {(string|null)} [value=null] - The value to check.
 * @param {string} name - The name of the parameter.
 * @param {error} errorType - The type of the error to throw in case of failure.
 * @returns {(string|null)} The checked value.
 *
 * @throws {@link bo.locales.I18nError I18n error}: The value must be a string value or null.
 */
Utility.isOptionalString = function (value, name, errorType) {

  if (value === undefined)
    value = null;

  if (value !== null && typeof value !== 'string' && !(value instanceof String))
    throw new errorType('c_optString', name);

  return value;
};

/**
 * Checks if value is a non-empty string.
 *
 * @function bo.shared.Utility.isMandatoryString
 * @param {string} [value] - The value to check.
 * @param {string} name - The name of the parameter.
 * @param {error} errorType - The type of the error to throw in case of failure.
 * @returns {string} The checked value.
 *
 * @throws {@link bo.locales.I18nError I18n error}: The argument must be a non-empty string.
 */
Utility.isMandatoryString = function (value, name, errorType) {

  if (typeof value !== 'string' && !(value instanceof String) || value.trim().length === 0)
    throw new errorType('m_manString', name);

  return value;
};

Object.freeze(Utility);

module.exports = Utility;
