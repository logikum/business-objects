'use strict';

var fs = require('fs');
var path = require('path');

var configHelper = {
  
  getFunction: function (relativePath, name, errorType) {

    if (typeof relativePath !== 'string' && !(relativePath instanceof String))
      throw new errorType('string', name);

    var fullPath = path.join(process.cwd(), relativePath);
    if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isFile())
      throw new errorType('file', name, fullPath);

    var requiredFunction = require(fullPath);
    if (typeof requiredFunction !== 'function')
      throw new errorType('function', name, fullPath);

    return requiredFunction;
  },

  getDirectory: function (relativePath, name, errorType) {

    if (typeof relativePath !== 'string' && !(relativePath instanceof String))
      throw new errorType('string', name);

    var fullPath = path.join(process.cwd(), relativePath);
    if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isDirectory())
      throw new errorType('directory', name, fullPath);

    return fullPath;
  },

  isEnumMember: function (value, enumType, name, errorType) {

    if (!(enumType && enumType.hasMember && enumType.constructor &&
        enumType.constructor.super_ && enumType.constructor.super_.name === 'Enumeration'))
      throw new errorType('enumType', enumType);

    if (!enumType.hasMember(value))
      throw new errorType('enumMember', name, enumType);

    return value;
  },

  isOptionalString: function (value, name, errorType) {

    if (value === undefined)
      value = null;

    if (value !== null && typeof value !== 'string' && !(value instanceof String))
      throw new errorType('c_optString', name);

    return value;
  },

  isMandatoryString: function (value, name, errorType) {

    if (typeof value !== 'string' && !(value instanceof String) || value.trim().length === 0)
      throw new errorType('m_manString', name);

    return value;
  }
};

Object.freeze(configHelper);

module.exports = configHelper;
