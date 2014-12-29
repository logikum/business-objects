"use strict";

console.log('Testing data portal methods of asynchronous commands...');

var ClearScheduleCommand = require('../sample/async/clear-schedule-command.js');

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
});
