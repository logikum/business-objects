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

var orderScheduleKey = new Property('orderScheduleKey', dt.Integer, F.key);
var orderItemKey = new Property('orderItemKey', dt.Integer, F.parentKey);
var quantity = new Property('quantity', dt.Integer);
var totalMass = new Property('totalMass', dt.Decimal);
var required = new Property('required', dt.Boolean);
var shipTo = new Property('shipTo', dt.Text);
var shipDate = new Property('shipDate', dt.DateTime);

var properties = new Properties(
  'BlanketOrderScheduleView',
  orderScheduleKey,
  orderItemKey,
  quantity,
  totalMass,
  required,
  shipTo,
  shipDate
);

var rules = new Rules(
);

var extensions = new Extensions('async-dal', __filename);
extensions.daoBuilder = daoBuilder;

var BlanketOrderScheduleView = bo.ReadOnlyModel(properties, rules, extensions);

module.exports = BlanketOrderScheduleView;
