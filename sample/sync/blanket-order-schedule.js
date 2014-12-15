'use strict';

var bo = require('../../source/index.js');

var Properties = bo.shared.PropertyManager;
var Rules = bo.rules.RuleManager;
var Extensions = bo.shared.ExtensionManager;
var Property = bo.shared.PropertyInfo;
var dt = bo.shared.dataTypes;
var cr = bo.commonRules;

var orderScheduleKey = new Property('orderScheduleKey', dt.Integer, false);
var productName = new Property('productName', dt.Text);
var quantity = new Property('quantity', dt.Integer);
var mass = new Property('mass', dt.Decimal);
var required = new Property('required', dt.Boolean);
var shipDate = new Property('shipDate', dt.DateTime);

var properties = new Properties(
    'BlanketOrderSchedule',
    orderScheduleKey,
    productName,
    quantity,
    mass,
    required,
    shipDate
);

var rules = new Rules(
    new cr.required(productName),
    new cr.required(quantity),
    new cr.required(mass),
    new cr.required(shipDate),
    new cr.required(required)
);

var extensions = new Extensions('dao', __filename);

var BlanketOrderSchedule = new bo.EditableModelSync(properties, rules, extensions);

module.exports = BlanketOrderSchedule;
