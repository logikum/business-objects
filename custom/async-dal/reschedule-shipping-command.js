'use strict';

var RescheduleShippingCommandDao = function() {

  this.execute = function(data, callback) {
    console.log('--- Reschedule shipping command DAO.execute');

    data.success = false;

    data.result = {};

    data.result.quantity = null;
    data.result.totalMass = null;
    data.result.required = null;
    data.result.shipTo = null;
    data.result.shipDate = null;

    callback(null, data);
  };

  this.reschedule = function(data, callback) {
    console.log('--- Reschedule shipping command DAO.reschedule');

    data.success = true;

    data.result = {};

    data.result.quantity = 2;
    data.result.totalMass = 0.21;
    data.result.required = false;
    data.result.shipTo = 'Berlin';
    data.result.shipDate = new Date(2015, 1, 3);

    callback(null, data);
  };

};

module.exports = RescheduleShippingCommandDao;
