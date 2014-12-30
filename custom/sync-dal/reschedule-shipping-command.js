'use strict';

var util = require('util');
var DaoBase = require('../../source/data-access/dao-base.js');

var RescheduleShippingCommandDao = function() {
  RescheduleShippingCommandDao.super_.call(this, 'RescheduleShippingCommandDao');
};
util.inherits(RescheduleShippingCommandDao, DaoBase);

RescheduleShippingCommandDao.prototype.execute = function(data) {
  console.log('--- Reschedule shipping command DAO.execute');

  data.success = false;

  data.result = {};

  data.result.quantity = null;
  data.result.totalMass = null;
  data.result.required = null;
  data.result.shipTo = null;
  data.result.shipDate = null;

  return data;
};

RescheduleShippingCommandDao.prototype.reschedule = function(data) {
  console.log('--- Reschedule shipping command DAO.reschedule');

  data.success = true;

  data.result = {};

  data.result.quantity = 1;
  data.result.totalMass = 0.19;
  data.result.required = true;
  data.result.shipTo = 'Budapest';
  data.result.shipDate = new Date(2014, 12, 30);

  return data;
};

module.exports = RescheduleShippingCommandDao;
