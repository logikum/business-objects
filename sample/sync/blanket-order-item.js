'use strict';

var bo = require('../../source/index.js');

var Properties = bo.shared.PropertyManager;
var Rules = bo.rules.RuleManager;
var Extensions = bo.shared.ExtensionManagerSync;
var Property = bo.shared.PropertyInfo;
var dt = bo.dataTypes;
var cr = bo.commonRules;

var BlanketOrderScheduleList = require('./blanket-order-schedule-list.js');

var orderItemKey = new Property('orderItemKey', dt.Integer, false);
var productName = new Property('productName', dt.Text);
var obsolete = new Property('obsolete', dt.Boolean);
var expiry = new Property('expiry', dt.DateTime);
var quantity = new Property('quantity', dt.Integer);
var unitPrice = new Property('unitPrice', dt.Decimal);
var schedules = new Property('schedules', BlanketOrderScheduleList);

var properties = new Properties(
    'BlanketOrderItem',
    orderItemKey,
    productName,
    obsolete,
    expiry,
    quantity,
    unitPrice,
    schedules
);

var rules = new Rules(
    new cr.required(productName),
    new cr.required(obsolete),
    new cr.required(expiry),
    new cr.required(quantity),
    new cr.required(unitPrice)
);

var extensions = new Extensions('dao', __filename);

var BlanketOrderItem = new bo.EditableModelSync(properties, rules, extensions);

module.exports = BlanketOrderItem;
