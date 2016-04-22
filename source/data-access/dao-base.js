'use strict';

var DaoError = require('./dao-error.js');

/**
 * @classdesc Serves as the base class for data access objects.
 * @description Creates a new data access object.
 *
 * @memberof bo.dataAccess
 * @constructor
 * @param {string} name - The name of the data access object.
 *
 * @throws {@link bo.dataAccess.DaoError Dao error}: The data access object name must be a non-empty string.
 */
var DaoBase = function (name) {

  if (typeof name !== 'string' && !(name instanceof String) || name.trim().length === 0)
    throw new DaoError('c_manString', 'name');

  /**
   * The name of the data access object.
   * @name bo.dataAccess.DaoBase#name
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
 * Executes the named method on the data access object.
 *
 * @function bo.dataAccess.DaoBase#$runMethod
 * @param {string} methodName - The name of the method to check.
 * @param {...*} [methodArg] - The arguments of the method to execute.
 * @returns {promise<*>} The result of the method.
 *
 * @throws {@link bo.dataAccess.DaoError Dao error}: The method name must be a non-empty string.
 * @throws {@link bo.dataAccess.DaoError Dao error}: Data access object has no method with the requested name.
 */
DaoBase.prototype.$runMethod = function (methodName) {

  if (typeof methodName !== 'string' || methodName.trim().length === 0)
    throw new DaoError('m_manString', 'checkMethod', 'methodName');
  if (!this[methodName] || typeof this[methodName] !== 'function')
    throw new DaoError('noMethod', this.name, methodName);

  var args = Array.prototype.slice.call(arguments);
  args.shift();

  return this[methodName].apply(this, args);
};

/**
 * Determines if create method exists.
 *
 * @function bo.dataAccess.DaoBase#$hasCreate
 * @returns {boolean} True when create method exists, otherwise false.
 */
DaoBase.prototype.$hasCreate = function () {
  return this['create'] !== undefined && typeof this['create'] === 'function';
};

Object.seal(DaoBase.prototype);

module.exports = DaoBase;
