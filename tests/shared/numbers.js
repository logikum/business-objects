'use strict';

var util = require('util');
var Enumeration = require('../../source/shared/enumeration.js');

function Numbers1() {
  Numbers1.super_.call(this);

  this.one = 0;

  Object.freeze(this);
}
util.inherits(Numbers1, Enumeration);

function Numbers2() {
  Numbers2.super_.call(this);

  this.one = 0;
  this.two = 1;

  Object.freeze(this);
}
util.inherits(Numbers2, Enumeration);

function Numbers3() {
  Numbers3.super_.call(this);

  this.one = 0;
  this.two = 1;
  this.three = 2;

  Object.freeze(this);
}
util.inherits(Numbers3, Enumeration);

module.exports.one = new Numbers1();
module.exports.two = new Numbers2();
module.exports.three = new Numbers3();
