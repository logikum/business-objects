
function DataTypeError(message) {

  this.name = 'DataTypeError';

  this.message = message || 'The data type of the passed value is invalid.';
}

DataTypeError.prototype = new Error();
DataTypeError.prototype.constructor = DataTypeError;

module.exports = DataTypeError;
