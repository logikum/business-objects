'use strict';

var ensureArgument = require('../shared/ensure-argument.js');
var DaoError = require('./dao-error.js');

/**
 * @classdesc Serves as the base class for data access objects.
 * @description Creates a new data access object.
 *
 * @memberof bo.dataAccess
 * @constructor
 * @param {string} name - The name of the data access object.
 *
 * @throws {@link bo.dataAccess.DaoError DaoError}: The data access object name must be a non-empty string.
 */
var DaoBase = function (name) {

  if (typeof name !== 'string' && !(name instanceof String) || name.trim().length === 0)
    throw new DaoError('c_manString', 'name');

  /**
   * The name of the data access object.
   * @type {string}
   * @readonly
   */
  Object.defineProperty(this, 'name', {
    get: function () {
      return name;
    },
    enumeration: true
  });
};

/**
 * Checks if the requested method exists on the data access object.
 *
 * @function bo.dataAccess.DaoBase#check
 * @param {string} methodName - The name of the method to check.
 *
 * @throws {@link bo.dataAccess.DaoError DaoError}: The method name must be a non-empty string.
 * @throws {@link bo.dataAccess.DaoError DaoError}: Data access object has no method with the requested name.
 */
DaoBase.prototype.checkMethod = function (methodName) {

  if (typeof methodName !== 'string' || methodName.trim().length === 0)
    throw new DaoError('m_manString', 'checkMethod', 'methodName');
  if (!this[methodName] || typeof this[methodName] !== 'function')
    throw new DaoError('noMethod', this.name, methodName);
};

Object.seal(DaoBase.prototype);

module.exports = DaoBase;
