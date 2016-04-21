'use strict';

var bo = require('../../source/index.js');

var Properties = bo.shared.PropertyManager;
var Rules = bo.rules.RuleManager;
var Extensions = bo.shared.ExtensionManager;
var Property = bo.shared.PropertyInfo;
var F = bo.shared.PropertyFlag;
var dt = bo.dataTypes;
var cr = bo.commonRules;

var orderScheduleKey = new Property('orderScheduleKey', dt.Integer, F.key | F.readOnly);
var orderItemKey = new Property('orderItemKey', dt.Integer, F.parentKey | F.readOnly);
var quantity = new Property('quantity', dt.Integer);
var totalMass = new Property('totalMass', dt.Decimal);
var required = new Property('required', dt.Boolean);
var shipTo = new Property('shipTo', dt.Text);
var shipDate = new Property('shipDate', dt.DateTime);

var properties = new Properties(
    orderScheduleKey,
    orderItemKey,
    quantity,
    totalMass,
    required,
    shipTo,
    shipDate
);

var rules = new Rules(
    cr.required(quantity),
    cr.required(totalMass),
    cr.required(required),
    cr.required(shipTo),
    cr.required(shipDate)
);

var extensions = new Extensions('dao', __filename);

var BlanketOrderSchedule = bo.EditableChildObject('BlanketOrderSchedule', properties, rules, extensions);

module.exports = BlanketOrderSchedule;
