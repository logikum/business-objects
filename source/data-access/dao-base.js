'use strict';

var DaoError = require('./dao-error.js');

var DaoBase = function (name) {

  if (typeof name !== 'string' || name.trim().length === 0)
    throw new DaoError('c_manString', 'name');
  else
    this.name = name;
};

DaoBase.prototype.checkMethod = function (methodName) {

  if (typeof methodName !== 'string' || methodName.trim().length === 0)
    throw new DaoError('m_manString', 'checkMethod', 'methodName');
  if (!this[methodName] || typeof this[methodName] !== 'function')
    throw new DaoError('noMethod', this.name, methodName);
};

module.exports = DaoBase;
