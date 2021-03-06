'use strict';

//region Imports

const fs = require( 'fs' );
const path = require( 'path' );

//endregion

/**
 * Provides static methods for configuration and internationalization.
 *
 * @memberof bo.system
 */
class Utility {

  /**
   * Gets a function read from a file.
   *
   * @function bo.system.Utility.getFunction
   * @static
   * @param {string} relativePath - The relative path of the file to read.
   * @param {string} name - The name of the configuration item.
   * @param {error} errorType - The type of the error to throw in case of failure.
   * @returns {function} The required function.
   *
   * @throws {@link bo.common.ConfigurationError Configuration} {@link bo.locales.I18nError I18n} error:
   *    The property value of business objects' configuration must be a string.
   * @throws {@link bo.common.ConfigurationError Configuration} {@link bo.locales.I18nError I18n} error:
   *    The property value of business objects' configuration is not a valid file path.
   * @throws {@link bo.common.ConfigurationError Configuration} {@link bo.locales.I18nError I18n} error:
   *    The file defined by the property of business objects' configuration must return a function.
   */
  static getFunction( relativePath, name, errorType ) {

    if ((typeof relativePath !== 'string' && !(relativePath instanceof String)) ||
      relativePath.trim().length === 0)
      throw new errorType( 'string', name );

    const fullPath = path.join( process.cwd(), relativePath );
    if (!fs.existsSync( fullPath ) || !fs.statSync( fullPath ).isFile())
      throw new errorType( 'file', name, fullPath );

    const requiredFunction = require( fullPath );
    if (typeof requiredFunction !== 'function')
      throw new errorType( 'function', name, fullPath );

    return requiredFunction;
  }

  /**
   * Gets the full path of a directory.
   *
   * @function bo.system.Utility.getDirectory
   * @static
   * @param {string} relativePath - The relative path of the directory.
   * @param {string} name - The name of the configuration item.
   * @param {error} errorType - The type of the error to throw in case of failure.
   * @returns {string} The full path of a directory.
   *
   * @throws {@link bo.common.ConfigurationError Configuration} {@link bo.locales.I18nError I18n} error:
   *    The property value of business objects' configuration must be a string.
   * @throws {@link bo.common.ConfigurationError Configuration} {@link bo.locales.I18nError I18n} error:
   *    The property value of business objects' configuration is not a valid directory path.
   */
  static getDirectory( relativePath, name, errorType ) {

    if ((typeof relativePath !== 'string' && !(relativePath instanceof String)) ||
      relativePath.trim().length === 0)
      throw new errorType( 'string', name );

    const fullPath = path.join( process.cwd(), relativePath );
    if (!fs.existsSync( fullPath ) || !fs.statSync( fullPath ).isDirectory())
      throw new errorType( 'directory', name, fullPath );

    return fullPath;
  }

  /**
   * Checks if value is member of a given enumeration.
   *
   * @function bo.system.Utility.isEnumMember
   * @param {(number|string)} value - The value to check.
   * @param {constructor} enumType - The type of the enumeration.
   * @param {string} name - The name of the configuration item.
   * @param {error} errorType - The type of the error to throw in case of failure.
   * @returns {number} The checked value.
   *
   * @throws {@link bo.common.ConfigurationError Configuration error}: Type is not an enumeration type.
   * @throws {@link bo.common.ConfigurationError Configuration error}: The argument must be an enumeration type item.
   */
  static isEnumMember( value, enumType, name, errorType ) {

    if (!(enumType && enumType.hasMember && enumType.constructor &&
      Object.getPrototypeOf( enumType.constructor ) &&
      Object.getPrototypeOf( enumType.constructor ).name === 'Enumeration'))
      throw new errorType( 'enumType', enumType );

    if (typeof value === 'string' && enumType.isMemberName( value ))
      value = enumType.getValue( value );
    else if (!enumType.hasMember( value ))
      throw new errorType( 'enumMember', name, enumType.$name );

    return value;
  }

  /**
   * Checks if value is a string or null.
   *
   * @function bo.system.Utility.isOptionalString
   * @param {(string|null)} [value=null] - The value to check.
   * @param {string} name - The name of the parameter.
   * @param {error} errorType - The type of the error to throw in case of failure.
   * @returns {(string|null)} The checked value.
   *
   * @throws {@link bo.locales.I18nError I18n error}: The value must be a string value or null.
   */
  static isOptionalString( value, name, errorType ) {

    if (value === undefined)
      value = null;

    if (value !== null && typeof value !== 'string' && !(value instanceof String))
      throw new errorType( 'c_optString', name );

    return value;
  }

  /**
   * Checks if value is a non-empty string.
   *
   * @function bo.system.Utility.isMandatoryString
   * @param {string} [value] - The value to check.
   * @param {string} name - The name of the parameter.
   * @param {error} errorType - The type of the error to throw in case of failure.
   * @returns {string} The checked value.
   *
   * @throws {@link bo.locales.I18nError I18n error}: The argument must be a non-empty string.
   */
  static isMandatoryString( value, name, errorType ) {

    if (typeof value !== 'string' && !(value instanceof String) || value.trim().length === 0)
      throw new errorType( 'm_manString', name );

    return value;
  }
}

Object.freeze( Utility );

module.exports = Utility;
