'use strict';

var bo = require('../../../source/index.js');

var Properties = bo.shared.PropertyManager;
var Rules = bo.rules.RuleManager;
var Extensions = bo.shared.ExtensionManagerSync;
var Property = bo.shared.PropertyInfo;
//var F = bo.shared.PropertyFlag;
var dt = bo.dataTypes;
var cr = bo.commonRules;

var orderKey = new Property('orderKey', dt.Integer);
var orderItemKey = new Property('orderItemKey', dt.Integer);
var orderScheduleKey = new Property('orderScheduleKey', dt.Integer);
var result = new Property('result', dt.Boolean);

var properties = new Properties(
    orderKey,
    orderItemKey,
    orderScheduleKey,
    result
);

var rules = new Rules(
    cr.required(orderKey),
    cr.required(orderItemKey),
    cr.required(orderScheduleKey)
);

var extensions = new Extensions('dao', __filename);

var ClearScheduleCommand = bo.CommandObjectSync('ClearScheduleCommand', properties, rules, extensions);

var ClearScheduleCommandFactory = {
  create: function (eventHandlers) {
    return ClearScheduleCommand.create(eventHandlers);
  }
};

module.exports = ClearScheduleCommandFactory;
