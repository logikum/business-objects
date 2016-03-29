'use strict';

var bo = require('../../../source/index.js');

var Properties = bo.shared.PropertyManager;
var Rules = bo.rules.RuleManager;
var Extensions = bo.shared.ExtensionManagerSync;
var Property = bo.shared.PropertyInfo;
var F = bo.shared.PropertyFlag;
var dt = bo.dataTypes;
var cr = bo.commonRules;

var BlanketOrderSchedulesView = require('./blanket-order-schedules-view.js');

var orderItemKey = new Property('orderItemKey', dt.Integer, F.key);
var orderKey = new Property('orderKey', dt.Integer, F.parentKey);
var productName = new Property('productName', dt.Text);
var obsolete = new Property('obsolete', dt.Boolean);
var expiry = new Property('expiry', dt.DateTime);
var quantity = new Property('quantity', dt.Integer);
var unitPrice = new Property('unitPrice', dt.Decimal);
var schedules = new Property('schedules', BlanketOrderSchedulesView);

var properties = new Properties(
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
);

var extensions = new Extensions('dao', __filename);

var BlanketOrderItemView = bo.ReadOnlyChildObjectSync('BlanketOrderItemView', properties, rules, extensions);

module.exports = BlanketOrderItemView;
