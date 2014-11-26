console.log('Testing data-types/index.js...');

var dt = require('../../source/data-types/index.js');
var Boolean = require('../../source/data-types/boolean.js');
var Text = require('../../source/data-types/text.js');
var Integer = require('../../source/data-types/integer.js');
var Decimal = require('../../source/data-types/decimal.js');
var DateTime = require('../../source/data-types/date-time.js');

describe('Data type index', function() {

  it('returns correct data types', function() {

    expect(dt.Boolean).toEqual(jasmine.any(Boolean));
    expect(dt.Text).toEqual(jasmine.any(Text));
    expect(dt.Integer).toEqual(jasmine.any(Integer));
    expect(dt.Decimal).toEqual(jasmine.any(Decimal));
    expect(dt.DateTime).toEqual(jasmine.any(DateTime));
  });
});
