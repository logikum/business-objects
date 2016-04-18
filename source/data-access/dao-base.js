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
 *    The last argument must be a callback function in case of asynchronous models.
 * @returns {*} The result of the method (for synchronous models).
 *
 * @throws {@link bo.dataAccess.DaoError Dao error}: The method name must be a non-empty string.
 * @throws {@link bo.dataAccess.DaoError Dao error}: Data access object has no method with the requested name.
 */
DaoBase.prototype.$runMethod = function (methodName) {

  var args = Array.prototype.slice.call(arguments);
  methodName = args.shift();

  if (typeof methodName !== 'string' || methodName.trim().length === 0)
    throw new DaoError('m_manString', 'checkMethod', 'methodName');
  if (!this[methodName] || typeof this[methodName] !== 'function')
    throw new DaoError('noMethod', this.name, methodName);

  var callback = args.length ? args[args.length - 1] : null;
  if (typeof callback === 'function'){
    args.pop();
    this[methodName].apply(this, args)
    .then( data => {
      callback( null, data );
    })
    .catch( reason => {
      callback( reason );
    });
  }
  else
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
