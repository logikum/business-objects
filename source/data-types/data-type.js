var NotImplementedError = require('../shared/not-implemented-error.js');

function DataType (ruleName) {

  this.name = ruleName;
}

DataType.prototype.check = function () {
  throw new NotImplementedError('The DataType.check method is not implemented.');
};

DataType.prototype.hasValue = function () {
  throw new NotImplementedError('The DataType.hasValue method is not implemented.');
};

module.exports = DataType;
