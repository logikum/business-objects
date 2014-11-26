var Boolean = require('./boolean.js');
var Text = require('./text.js');
var Integer = require('./integer.js');
var Decimal = require('./decimal.js');
var DateTime = require('./date-time.js');

var index = {
  Boolean: new Boolean(),
  Text: new Text(),
  Integer: new Integer(),
  Decimal: new Decimal(),
  DateTime: new DateTime()
};

Object.freeze(index);

module.exports = index;
