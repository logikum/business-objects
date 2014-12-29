"use strict";

console.log('Testing data portal methods of synchronous commands...');

var ClearScheduleCommand = require('../sample/sync/clear-schedule-command.js');

describe('Synchronous data portal method', function () {

  it('execute of sample command', function () {
    console.log('\n*** Synchronous EXECUTE');

    var cmd = ClearScheduleCommand.create();

    cmd.orderKey = 1;
    cmd.orderItemKey = 2;
    cmd.orderScheduleKey = 3;

    cmd.execute();

    expect(cmd.result).toBe(true);
  });
});
