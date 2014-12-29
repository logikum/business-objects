'use strict';

var RescheduleShippingCommandDao = function() {

  this.reschedule = function(data) {
    console.log('--- Reschedule shipping command DAO.reschedule');

    data.result = true;

    data.result.quantity = 1;
    data.result.totalMass = 0.19;
    data.result.required = true;
    data.result.shipTo = 'Budapest';
    data.result.shipDate = new Date(2014, 12, 30);

    return data;
  };

};

module.exports = RescheduleShippingCommandDao;
