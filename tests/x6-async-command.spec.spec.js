"use strict";

console.log('Testing data portal methods of asynchronous commands...');

var ClearScheduleCommand = require('../sample/async/clear-schedule-command.js');
var RescheduleShippingCommand = require('../custom/async-models/reschedule-shipping-command.js');
var RescheduleShippingResult = require('../custom/async-models/reschedule-shipping-result.js');

describe('Asynchronous data portal method', function () {

  it('execute of sample command', function () {
    console.log('\n*** Asynchronous EXECUTE');

    ClearScheduleCommand.create(function (err, cmd) {

      cmd.orderKey = 1;
      cmd.orderItemKey = 2;
      cmd.orderScheduleKey = 3;

      cmd.execute(function (err, cmd) {

        expect(cmd.result).toBe(true);
      });
    });
  });

  it('execute of custom command', function () {
    console.log('\n*** Asynchronous RESCHEDULE');

    var cmd = RescheduleShippingCommand.create(function (err, cmd) {

      cmd.orderKey = 1;
      cmd.orderItemKey = 2;
      cmd.orderScheduleKey = 3;

      cmd.reschedule(function (err) {
        if (err) throw err;

        expect(cmd.success).toBe(true);
        expect(cmd.result).toEqual(jasmine.any(RescheduleShippingResult));

        expect(cmd.result.quantity).toBe(2);
        expect(cmd.result.totalMass).toBe(0.21);
        expect(cmd.result.required).toBe(false);
        expect(cmd.result.shipTo).toBe('Berlin');
        expect(cmd.result.shipDate).toEqual(new Date(2015, 1, 3));
      });
    });
  });
});
