'use strict';

var util = require('util');
var DaoBase = require('../../../source/data-access/dao-base.js');

var RescheduleShippingCommandDao = function() {
  RescheduleShippingCommandDao.super_.call(this, 'RescheduleShippingCommandDao');
};
util.inherits(RescheduleShippingCommandDao, DaoBase);

RescheduleShippingCommandDao.prototype.execute = function(connection, data) {
  console.log('--- Reschedule shipping command DAO.execute');

  return new Promise( (fulfill, reject) => {
    data.success = false;

    data.result = {};

    data.result.quantity = null;
    data.result.totalMass = null;
    data.result.required = null;
    data.result.shipTo = null;
    data.result.shipDate = null;

    fulfill( data );
  });
};

RescheduleShippingCommandDao.prototype.reschedule = function(connection, data) {
  console.log('--- Reschedule shipping command DAO.reschedule');

  return new Promise( (fulfill, reject) => {
    data.success = true;

    data.result = {};

    data.result.quantity = 2;
    data.result.totalMass = 0.21;
    data.result.required = false;
    data.result.shipTo = 'Berlin';
    data.result.shipDate = new Date(2015, 1, 3);

    fulfill( data );
  });
};

module.exports = RescheduleShippingCommandDao;
