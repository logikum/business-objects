console.log('Testing data-types/index.js...');

var dt = require('../../source/data-types/index.js');
//var DataType = require('../../source/data-types/data-type.js');
//var DataTypeError = require('../../source/data-types/data-type-error.js');
var Boolean = require('../../source/data-types/boolean.js');
var Text = require('../../source/data-types/text.js');
var Email = require('../../source/data-types/email.js');
var Integer = require('../../source/data-types/integer.js');
var Decimal = require('../../source/data-types/decimal.js');
//var Enum = require('../../source/data-types/enum.js');
var DateTime = require('../../source/data-types/date-time.js');

describe('Data type index', function() {

  it('returns correct data types', function() {

    expect(dt.DataType).toEqual(jasmine.any(Function));
    expect(dt.DataTypeError).toEqual(jasmine.any(Function));

    expect(dt.Boolean).toEqual(jasmine.any(Boolean));
    expect(dt.Text).toEqual(jasmine.any(Text));
    expect(dt.Email).toEqual(jasmine.any(Email));
    expect(dt.Integer).toEqual(jasmine.any(Integer));
    expect(dt.Decimal).toEqual(jasmine.any(Decimal));
    expect(dt.Enum).toEqual(jasmine.any(Function));
    expect(dt.DateTime).toEqual(jasmine.any(DateTime));
  });
});
