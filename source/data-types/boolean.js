var DataType = require('./data-type.js');
var DataTypeError = require('../shared/data-type-error.js');

var Boolean = {

  create: function (ruleName) {

    var dataType = DataType.create.call(this, 'Boolean').extend({

      check: function (value) {
        if (value !== null && typeof value !== 'boolean')
          throw new DataTypeError('The passed value is not Boolean.')
      },

      hasValue: function (value) {
        this.check(value);
        return value != undefined && value != null;
      }
    });

    Object.freeze(dataType);

    return dataType;
  }
};

module.exports = Boolean;
