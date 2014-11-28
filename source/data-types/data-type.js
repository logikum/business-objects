'use strict';

var ensureArgument = require('../shared/ensure-argument.js');
var NotImplementedError = require('../shared/not-implemented-error.js');

function DataType (ruleName) {

  this.name = ensureArgument.isMandatoryString(ruleName,
      'The ruleName argument of DataType constructor must be a string or null.');
}

DataType.prototype.check = function () {
  throw new NotImplementedError('The DataType.check method is not implemented.');
};

DataType.prototype.hasValue = function () {
  throw new NotImplementedError('The DataType.hasValue method is not implemented.');
};

module.exports = DataType;
