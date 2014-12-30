'use strict';

var util = require('util');
var DaoBase = require('../../source/data-access/dao-base.js');

var RescheduleShippingResultDao = function() {
  RescheduleShippingResultDao.super_.call(this, 'RescheduleShippingResultDao');
};
util.inherits(RescheduleShippingResultDao, DaoBase);

module.exports = RescheduleShippingResultDao;
