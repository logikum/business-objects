//region Imports

var ClearScheduleCommand = require('../../data/simple-core/clear-schedule-command.js');
var RescheduleShippingCommand = require('../../data/custom-core/models/reschedule-shipping-command.js');
var RescheduleShippingResult = require('../../data/custom-core/models/reschedule-shipping-result.js');

var DataPortalEvent = require('../../source/shared/data-portal-event.js');
var EventHandlerList = require('../../source/shared/event-handler-list.js');

//endregion

describe('Data portal method', () => {

  function showTitle() {
    console.log('');
    console.log('--------------------------------------------------');
    console.log('Testing data portal methods of commands...' );
    console.log('--------------------------------------------------');
  }

  //region Event handlers

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

  //endregion

  it( 'EXECUTE of simple command', done => {
    showTitle();
    console.log( '\n*** Method EXECUTE' );

    var cmd = ClearScheduleCommand.create( ehClearScheduleCommand );

    //cmd.on('preExecute', eventArgs => {
    //  console.log('  : ' + eventArgs.modelName + '.' + eventArgs.methodName + ':preExecute event.');
    //});
    //cmd.on('postExecute', eventArgs => {
    //  console.log('  : ' + eventArgs.modelName + '.' + eventArgs.methodName + ':postExecute event.');
    //});

    cmd.orderKey = 1;
    cmd.orderItemKey = 2;
    cmd.orderScheduleKey = 3;

    cmd.execute()
    .then( value => {

      expect(cmd.result).toBe(true);

      done();
    });
  });

  it( 'RESCHEDULE of custom command', done => {
    console.log( '\n*** Method RESCHEDULE' );

    var cmd = RescheduleShippingCommand.create( ehRescheduleShippingCommand );

    cmd.orderKey = 1;
    cmd.orderItemKey = 2;
    cmd.orderScheduleKey = 3;

    cmd.reschedule()
    .then( value => {

      expect(cmd.success).toBe(true);
      expect(cmd.result).toEqual(jasmine.any(RescheduleShippingResult));

      expect(cmd.result.quantity).toBe(2);
      expect(cmd.result.totalMass).toBe(0.21);
      expect(cmd.result.required).toBe(false);
      expect(cmd.result.shipTo).toBe('Berlin');
      expect(cmd.result.shipDate).toEqual(new Date(2015, 1, 3));

      done();
    });
  });
});
