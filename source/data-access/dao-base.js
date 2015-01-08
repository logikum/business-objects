'use strict';

var ensureArgument = require('../shared/ensure-argument.js');
var DaoError = require('./dao-error.js');

var DaoBase = function (name) {

  if (typeof name !== 'string' && !(name instanceof String) || name.trim().length === 0)
    throw new DaoError('c_manString', 'name');

  Object.defineProperty(this, 'name', {
    get: function () {
      return name;
    },
    enumeration: true
  });
};

DaoBase.prototype.checkMethod = function (methodName) {

  if (typeof methodName !== 'string' || methodName.trim().length === 0)
    throw new DaoError('m_manString', 'checkMethod', 'methodName');
  if (!this[methodName] || typeof this[methodName] !== 'function')
    throw new DaoError('noMethod', this.name, methodName);
};

Object.seal(DaoBase.prototype);

module.exports = DaoBase;
