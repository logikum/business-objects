'use strict';

var util = require('util');
var DaoBase = require('../source/data-access/dao-base.js');

var WidgetDao = function() {
  WidgetDao.super_.call(this, 'WidgetDao');
};
util.inherits(WidgetDao, DaoBase);

WidgetDao.prototype.select = function(data) {
  return 'Hello, world!';
};

module.exports = WidgetDao;
