"use strict";

console.log('Testing data portal methods of synchronous commands...');

var ClearScheduleCommandSync = require('../sample/sync/clear-schedule-command.js');
var RescheduleShippingCommand = require('../custom/sync-models/reschedule-shipping-command.js');
var RescheduleShippingResult = require('../custom/sync-models/reschedule-shipping-result.js');

describe('Synchronous data portal method', function () {

  it('execute of sample command', function () {
    console.log('\n*** Synchronous EXECUTE');

    var cmd = ClearScheduleCommandSync.create();

    cmd.orderKey = 1;
    cmd.orderItemKey = 2;
    cmd.orderScheduleKey = 3;

    cmd.execute();

    expect(cmd.result).toBe(true);
  });

  it('execute of custom command', function () {
    console.log('\n*** Synchronous RESCHEDULE');

    var cmd = RescheduleShippingCommand.create();

    cmd.orderKey = 1;
    cmd.orderItemKey = 2;
    cmd.orderScheduleKey = 3;

    cmd.reschedule();

    expect(cmd.success).toBe(true);
    expect(cmd.result).toEqual(jasmine.any(RescheduleShippingResult));

    expect(cmd.result.quantity).toBe(1);
    expect(cmd.result.totalMass).toBe(0.19);
    expect(cmd.result.required).toBe(true);
    expect(cmd.result.shipTo).toBe('Budapest');
    expect(cmd.result.shipDate).toEqual(new Date(2014, 12, 30));
  });
});
