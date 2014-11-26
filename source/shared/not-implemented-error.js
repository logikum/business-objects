
function NotImplementedError(message) {

  this.name = 'NotImplementedError';

  this.message = message || 'The method is not implemented.';
}

NotImplementedError.prototype = new Error();
NotImplementedError.prototype.constructor = NotImplementedError;

module.exports = NotImplementedError;
