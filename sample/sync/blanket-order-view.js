'use strict';

var bo = require('../../source/index.js');

var Properties = bo.shared.PropertyManager;
var Rules = bo.rules.RuleManager;
var Action = bo.rules.AuthorizationAction;
var Extensions = bo.shared.ExtensionManagerSync;
var Property = bo.shared.PropertyInfo;
var F = bo.shared.PropertyFlag;
var dt = bo.dataTypes;
var cr = bo.commonRules;

var AddressView = require('./address-view.js');
var BlanketOrderItemsView = require('./blanket-order-items-view.js');

var orderKey = new Property('orderKey', dt.Integer, F.key);
var vendorName = new Property('vendorName', dt.Text);
var contractDate = new Property('contractDate', dt.DateTime);
var totalPrice = new Property('totalPrice', dt.Decimal);
var schedules = new Property('schedules', dt.Integer);
var enabled = new Property('enabled', dt.Boolean);
var address = new Property('address', AddressView);
var items = new Property('items', BlanketOrderItemsView);
var createdDate = new Property('createdDate', dt.DateTime);
var modifiedDate = new Property('modifiedDate', dt.DateTime);

var properties = new Properties(
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
    cr.isInRole(Action.fetchObject, null, 'designers', 'You are not authorized to retrieve blanket order.'),
    cr.isInAnyRole(Action.readProperty, totalPrice, ['salesmen', 'administrators'],
        'You are not authorized to view the totalPrice of the blanket order.')
);

var extensions = new Extensions('dao', __filename);

var BlanketOrderView = bo.ReadOnlyRootModelSync('BlanketOrderView', properties, rules, extensions);

var BlanketOrderViewFactory = {
  get: function (key, eventHandlers) {
    return BlanketOrderView.fetch(key, null, eventHandlers);
  },
  getByName: function (name, eventHandlers) {
    return BlanketOrderView.fetch(name, 'fetchByName', eventHandlers);
  }
};

module.exports = BlanketOrderViewFactory;
