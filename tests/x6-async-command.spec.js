console.log('Testing data portal methods of asynchronous commands...');

var ClearScheduleCommand = require('../sample/async/clear-schedule-command.js');
var RescheduleShippingCommand = require('../custom/async-models/reschedule-shipping-command.js');
var RescheduleShippingResult = require('../custom/async-models/reschedule-shipping-result.js');

var DataPortalEvent = require('../source/shared/data-portal-event.js');
var EventHandlerList = require('../source/shared/event-handler-list.js');

describe('Asynchronous data portal method', function () {

  function logEvent (eventArgs) {
    var id = eventArgs.modelName + '.' + eventArgs.methodName + ':' + eventArgs.eventName;
    console.log('  : ' + id + ' event.');
  }

  var ehClearScheduleCommand = new EventHandlerList();
  ehClearScheduleCommand.add('ClearScheduleCommand', DataPortalEvent.preExecute, logEvent);
  ehClearScheduleCommand.add('ClearScheduleCommand', DataPortalEvent.postExecute, logEvent);

  var ehRescheduleShippingCommand = new EventHandlerList();
  ehRescheduleShippingCommand.add('RescheduleShippingCommand', DataPortalEvent.preExecute, logEvent);
  ehRescheduleShippingCommand.add('RescheduleShippingCommand', DataPortalEvent.postExecute, logEvent);
  ehRescheduleShippingCommand.add('RescheduleShippingResult', DataPortalEvent.preFetch, logEvent);
  ehRescheduleShippingCommand.add('RescheduleShippingResult', DataPortalEvent.postFetch, logEvent);

  it('execute of sample command', function () {
    console.log('\n*** Asynchronous EXECUTE');

    ClearScheduleCommand.create(ehClearScheduleCommand, function (err, cmd) {

      cmd.on('preExecute', function (eventArgs) {
        console.log('  : ' + eventArgs.modelName + '.' + eventArgs.methodName + ':preExecute event.');
      });
      cmd.on('postExecute', function (eventArgs) {
        console.log('  : ' + eventArgs.modelName + '.' + eventArgs.methodName + ':postExecute event.');
      });

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

    RescheduleShippingCommand.create(ehRescheduleShippingCommand, function (err, cmd) {

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
