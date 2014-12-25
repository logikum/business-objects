'use strict';

var bo = require('../../source/index.js');
var daoBuilder = require('../dao-builder.js');

var Properties = bo.shared.PropertyManager;
var Rules = bo.rules.RuleManager;
var Extensions = bo.shared.ExtensionManager;
var Property = bo.shared.PropertyInfo;
var F = bo.shared.PropertyFlag;
var dt = bo.dataTypes;
var cr = bo.commonRules;

var BlanketOrderSchedules = require('./blanket-order-schedules.js');

var orderItemKey = new Property('orderItemKey', dt.Integer, F.key | F.readOnly);
var orderKey = new Property('orderKey', dt.Integer, F.parentKey | F.readOnly);
var productName = new Property('productName', dt.Text);
var obsolete = new Property('obsolete', dt.Boolean);
var expiry = new Property('expiry', dt.DateTime);
var quantity = new Property('quantity', dt.Integer);
var unitPrice = new Property('unitPrice', dt.Decimal);
var schedules = new Property('schedules', BlanketOrderSchedules);

var properties = new Properties(
    'BlanketOrderItem',
    orderItemKey,
    orderKey,
    productName,
    obsolete,
    expiry,
    quantity,
    unitPrice,
    schedules
);

var rules = new Rules(
    cr.required(productName),
    cr.required(obsolete),
    cr.required(expiry),
    cr.required(quantity),
    cr.required(unitPrice)
);

var extensions = new Extensions('async-dal', __filename);
extensions.daoBuilder = daoBuilder;

var BlanketOrderItem = bo.EditableModel(properties, rules, extensions);

module.exports = BlanketOrderItem;
