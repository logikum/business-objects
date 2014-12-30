'use strict';

var ensureArgument = require('../shared/ensure-argument.js');

var DaoBase = function (name) {

  this.name = ensureArgument.isMandatoryString(name,
      'The name argument of a data access object constructor must be a non-empty string.');
};

DaoBase.prototype.checkMethod = function (methodName) {
  methodName = ensureArgument.isMandatoryString(methodName,
      'The methodName argument of DaoBase.checkMethod method must be a non-empty-string.');
  if (!this[methodName] || typeof this[methodName] !== 'function')
    throw new Error(this.name + ' object has no method named ' + methodName + '.');
};

module.exports = DaoBase;
