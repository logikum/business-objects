'use strict';

var bo = require('../../source/index.js');
var daoBuilder = require('../dao-builder.js');
var Model = bo.ModelComposerSync;

var RescheduleShippingResult = require('./reschedule-shipping-result.js');

//region Data portal methods

function dataExecute (ctx, method) {
    var dto = {
        orderKey:         ctx.getValue('orderKey'),
        orderItemKey:     ctx.getValue('orderItemKey'),
        orderScheduleKey: ctx.getValue('orderScheduleKey')
    };
    if (method === 'reschedule')
        dto = ctx.dao.reschedule(ctx.connection, dto);
    else
        dto = ctx.dao.execute(ctx.connection, dto);
    // or:
    // dto = ctx.dao[method](ctx.connection, dto);
    ctx.setValue('success', dto.success);
    return dto;
}

//endregion

var RescheduleShippingCommand = Model('RescheduleShippingCommand').commandObject('sync-dal', __filename)
    .integer('orderKey')
    .integer('orderItemKey')
    .integer('orderScheduleKey')
    .boolean('success')
    .property('result', RescheduleShippingResult)
    .daoBuilder(daoBuilder)
    .dataExecute(dataExecute)
    .addOtherMethod('reschedule')
    .compose();

var RescheduleShippingCommandFactory = {
    create: function (eventHandlers) {
        return RescheduleShippingCommand.create(eventHandlers);
    }
};

module.exports = RescheduleShippingCommandFactory;
