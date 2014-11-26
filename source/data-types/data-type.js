var NotImplementedError = require('../shared/not-implemented-error.js');

var DataType = {

  create: function (ruleName) {

    var e = Object.prototype.extend;
    return this.extend({

      name: ruleName,

      check: function () {
        throw new NotImplementedError('The DataType.check method is not implemented.');
      },

      hasValue: function () {
        throw new NotImplementedError('The DataType.hasValue method is not implemented.');
      }
    });
  }
};

module.exports = DataType;
