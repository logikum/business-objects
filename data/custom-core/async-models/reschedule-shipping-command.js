'use strict';

var bo = require('../../../source/index.js');
var daoBuilder = require('../dao-builder.js');

var Properties = bo.shared.PropertyManager;
var Rules = bo.rules.RuleManager;
var Action = bo.rules.AuthorizationAction;
var Extensions = bo.shared.ExtensionManager;
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
    cr.required(orderScheduleKey),
    cr.isInRole(Action.executeMethod, 'reschedule', 'developers', 'You are not authorized to execute the command.')
);

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

var extensions = new Extensions('async-dal', __filename);
extensions.daoBuilder = daoBuilder;
extensions.dataExecute = dataExecute;
extensions.addOtherMethod('reschedule');

var RescheduleShippingCommand = bo.CommandObject('ClearScheduleCommand', properties, rules, extensions);

module.exports = RescheduleShippingCommand;
