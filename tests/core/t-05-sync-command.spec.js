console.log('Testing data portal methods of synchronous commands...');

var ClearScheduleCommandSync = require('../../data/simple-core/sync/clear-schedule-command.js');
var RescheduleShippingCommand = require('../../data/custom-core/sync-models/reschedule-shipping-command.js');
var RescheduleShippingResult = require('../../data/custom-core/sync-models/reschedule-shipping-result.js');

var DataPortalEvent = require('../../source/shared/data-portal-event.js');
var EventHandlerList = require('../../source/shared/event-handler-list.js');

describe('Synchronous data portal method', function () {

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
    console.log('\n*** Synchronous EXECUTE');

    var cmd = ClearScheduleCommandSync.create(ehClearScheduleCommand);

    cmd.orderKey = 1;
    cmd.orderItemKey = 2;
    cmd.orderScheduleKey = 3;

    cmd.execute();

    expect(cmd.result).toBe(true);
  });

  it('execute of custom command', function () {
    console.log('\n*** Synchronous RESCHEDULE');

    var cmd = RescheduleShippingCommand.create(ehRescheduleShippingCommand);

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
