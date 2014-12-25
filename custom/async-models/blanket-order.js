'use strict';

var bo = require('../../source/index.js');
var daoBuilder = require('../dao-builder.js');

var Properties = bo.shared.PropertyManager;
var Rules = bo.rules.RuleManager;
var Action = bo.rules.AuthorizationAction;
var Extensions = bo.shared.ExtensionManager;
var Property = bo.shared.PropertyInfo;
var F = bo.shared.PropertyFlag;
var dt = bo.dataTypes;
var cr = bo.commonRules;

var Address = require('./address.js');
var BlanketOrderItems = require('./blanket-order-items.js');

var orderKey = new Property('orderKey', dt.Integer, F.key | F.readOnly);
var vendorName = new Property('vendorName', dt.Text);
var contractDate = new Property('contractDate', dt.DateTime);
var totalPrice = new Property('totalPrice', dt.Decimal);
var schedules = new Property('schedules', dt.Integer);
var enabled = new Property('enabled', dt.Boolean);
var address = new Property('address', Address);
var items = new Property('items', BlanketOrderItems);
var createdDate = new Property('createdDate', dt.DateTime, F.readOnly);
var modifiedDate = new Property('modifiedDate', dt.DateTime, F.readOnly);

var properties = new Properties(
    'BlanketOrder',
    orderKey,
    vendorName,
    contractDate,
    totalPrice,
    schedules,
    enabled,
    address,
    items,
    createdDate,
    modifiedDate
);

var rules = new Rules(
    cr.required(vendorName),
    cr.required(contractDate),
    cr.required(totalPrice),
    cr.required(schedules),
    cr.required(enabled),
    cr.isInRole(Action.fetchObject, null, 'developers', 'You are not authorized to retrieve blanket order.'),
    cr.isInRole(Action.createObject, null, 'developers', 'You are not authorized to create blanket order.'),
    cr.isInRole(Action.updateObject, null, 'developers', 'You are not authorized to modify blanket order.'),
    cr.isInRole(Action.removeObject, null, 'developers', 'You are not authorized to delete blanket order.')
);

var extensions = new Extensions('async-dal', __filename);
extensions.daoBuilder = daoBuilder;

var BlanketOrder = bo.EditableModel(properties, rules, extensions);

var BlanketOrderFactory = {
  create: function (callback) {
    BlanketOrder.create(callback);
  },
  get: function (key, callback) {
    BlanketOrder.fetch(key, null, callback);
  },
  getByName: function (name, callback) {
    BlanketOrder.fetch(name, 'fetchByName', callback);
  }
};

module.exports = BlanketOrderFactory;
