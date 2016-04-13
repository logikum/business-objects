'use strict';

var bo = require('../../../source/index.js');
var daoBuilder = require('../dao-builder.js');

var Properties = bo.shared.PropertyManager;
var Rules = bo.rules.RuleManager;
var Action = bo.rules.AuthorizationAction;
var Extensions = bo.shared.ExtensionManager;
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

//region Transfer object methods

function fromDto (ctx, dto) {
  ctx.setValue('orderKey',     dto.orderKey);
  ctx.setValue('vendorName',   dto.vendorName);
  ctx.setValue('contractDate', dto.contractDate);
  ctx.setValue('totalPrice',   dto.totalPrice);
  ctx.setValue('schedules',    dto.schedules);
  ctx.setValue('enabled',      dto.enabled);
  ctx.setValue('createdDate',  dto.createdDate);
  ctx.setValue('modifiedDate', dto.modifiedDate);
}

function toCto (ctx) {
  return {
    orderKey:     this.orderKey,
    vendorName:   this.vendorName,
    contractDate: this.contractDate,
    totalPrice:   this.totalPrice,
    schedules:    this.schedules,
    enabled:      this.enabled,
    createdDate:  this.createdDate,
    modifiedDate: this.modifiedDate
  };
}

//endregion

//region Data portal methods

function dataFetch (ctx, filter, method, callback) {
  function cb (err, dto) {
    if (err)
      callback(err);
    else {
      ctx.setValue('orderKey',     dto.orderKey);
      ctx.setValue('vendorName',   dto.vendorName);
      ctx.setValue('contractDate', dto.contractDate);
      ctx.setValue('totalPrice',   dto.totalPrice);
      ctx.setValue('schedules',    dto.schedules);
      ctx.setValue('enabled',      dto.enabled);
      ctx.setValue('createdDate',  dto.createdDate);
      ctx.setValue('modifiedDate', dto.modifiedDate);
      callback(null, dto);
    }
  }
  if (method === 'fetchByName') {
    // filter: vendorName
    ctx.dao.fetchByName(ctx.connection, filter, cb);
  } else {
    // filter: primaryKey
    ctx.dao.fetch(ctx.connection, filter, cb);
  }
  // or:
  // ctx.dao[method](ctx.connection, filter, cb);
}

//endregion

var extensions = new Extensions('async-dal', __filename);
extensions.daoBuilder = daoBuilder;
extensions.fromDto = fromDto;
extensions.toCto = toCto;
extensions.dataFetch = dataFetch;

var BlanketOrderView = bo.ReadOnlyRootObject('BlanketOrderView', properties, rules, extensions);

var BlanketOrderViewFactory = {
  get: function (key, eventHandlers) {
    return BlanketOrderView.fetch(key, null, eventHandlers);
  },
  getByName: function (name, eventHandlers) {
    return BlanketOrderView.fetch(name, 'fetchByName', eventHandlers);
  }
};

module.exports = BlanketOrderViewFactory;
