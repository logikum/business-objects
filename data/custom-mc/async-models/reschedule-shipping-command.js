'use strict';

var bo = require('../../../source/index.js');
var daoBuilder = require('../dao-builder.js');
var Model = bo.ModelComposer;

var RescheduleShippingResult = require('./reschedule-shipping-result.js');

//region Data portal methods

function dataExecute (ctx, method, callback) {
  function cb (err, dto) {
    if (err)
      callback(err);
    else {
      ctx.setValue('success', dto.success);
      callback(null, dto);
    }
  }
  var dto = {
    orderKey:         ctx.getValue('orderKey'),
    orderItemKey:     ctx.getValue('orderItemKey'),
    orderScheduleKey: ctx.getValue('orderScheduleKey')
  };
  if (method === 'reschedule')
    ctx.dao.reschedule(ctx.connection, dto, cb);
  else
    dto = ctx.dao.execute(ctx.connection, dto, cb);
  // or:
  // ctx.dao[method](ctx.connection, dto, cb);
}

//endregion

var RescheduleShippingCommand = Model('RescheduleShippingCommand').commandObject('async-dal', __filename)
    .integer('orderKey')
        .required()
    .integer('orderItemKey')
        .required()
    .integer('orderScheduleKey')
        .required()
    .boolean('success')
    .property('result', RescheduleShippingResult)
    .daoBuilder(daoBuilder)
    .dataExecute(dataExecute)
    .addOtherMethod('reschedule')
    .compose();

var RescheduleShippingCommandFactory = {
  create: function (eventHandlers, callback) {
    RescheduleShippingCommand.create(eventHandlers, callback);
  }
};

module.exports = RescheduleShippingCommandFactory;
