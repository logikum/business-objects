'use strict';

var bo = require('../../source/index.js');
var daoBuilder = require('../dao-builder.js');

var Properties = bo.shared.PropertyManager;
var Rules = bo.rules.RuleManager;
var Extensions = bo.shared.ExtensionManagerSync;
var Property = bo.shared.PropertyInfo;
//var F = bo.shared.PropertyFlag;
var dt = bo.dataTypes;
var cr = bo.commonRules;

var RescheduleShippingResult = require('./reschedule-shipping-result.js');

var orderKey = new Property('orderKey', dt.Integer);
var orderItemKey = new Property('orderItemKey', dt.Integer);
var orderScheduleKey = new Property('orderScheduleKey', dt.Integer);
var success = new Property('success', dt.Boolean);
var result = new Property('result', RescheduleShippingResult);

var properties = new Properties(
    orderKey,
    orderItemKey,
    orderScheduleKey,
    success,
    result
);

var rules = new Rules(
    cr.required(orderKey),
    cr.required(orderItemKey),
    cr.required(orderScheduleKey)
);

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

var extensions = new Extensions('sync-dal', __filename);
extensions.daoBuilder = daoBuilder;
extensions.dataExecute = dataExecute;
extensions.addOtherMethod('reschedule');

var RescheduleShippingCommand = bo.CommandObjectSync('ClearScheduleCommand', properties, rules, extensions);

var RescheduleShippingCommandFactory = {
  create: function (eventHandlers) {
    return RescheduleShippingCommand.create(eventHandlers);
  }
};

module.exports = RescheduleShippingCommandFactory;
