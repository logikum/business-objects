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
    'ClearScheduleCommand',
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

var extensions = new Extensions('sync-dal', __filename);
extensions.daoBuilder = daoBuilder;

var RescheduleShippingCommand = bo.CommandObjectSync(properties, rules, extensions);

var RescheduleShippingCommandFactory = {
  create: function () {
    return RescheduleShippingCommand.create();
  },
  reschedule: function () {
    RescheduleShippingCommand.execute('reschedule');
  }
};

module.exports = RescheduleShippingCommandFactory;
