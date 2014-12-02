'use strict';

var ensureArgument = require('../shared/ensure-argument.js');
var NotImplementedError = require('../shared/not-implemented-error.js');

function DataType (name) {

  this.name = ensureArgument.isMandatoryString(name,
      'The name argument of DataType constructor must be a non-empty string.');
}

DataType.prototype.check = function () {
  throw new NotImplementedError('The DataType.check method is not implemented.');
};

DataType.prototype.hasValue = function () {
  throw new NotImplementedError('The DataType.hasValue method is not implemented.');
};

module.exports = DataType;
