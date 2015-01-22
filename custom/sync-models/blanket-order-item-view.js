'use strict';

var bo = require('../../source/index.js');
var daoBuilder = require('../dao-builder.js');

var Properties = bo.shared.PropertyManager;
var Rules = bo.rules.RuleManager;
var Extensions = bo.shared.ExtensionManagerSync;
var Property = bo.shared.PropertyInfo;
var F = bo.shared.PropertyFlag;
var dt = bo.dataTypes;
var cr = bo.commonRules;

var BlanketOrderSchedulesView = require('./blanket-order-schedules-view.js');

function getItemCode (ctx) {
  return ctx.getValue('orderItemKey').toString(2);
}

var orderItemKey = new Property('orderItemKey', dt.Integer, F.key | F.notOnCto);
var orderItemCode = new Property('orderItemCode', dt.Integer, F.notOnDto, getItemCode);
var orderKey = new Property('orderKey', dt.Integer, F.parentKey | F.notOnCto);
var productName = new Property('productName', dt.Text);
var obsolete = new Property('obsolete', dt.Boolean);
var expiry = new Property('expiry', dt.DateTime);
var quantity = new Property('quantity', dt.Integer);
var unitPrice = new Property('unitPrice', dt.Decimal);
var schedules = new Property('schedules', BlanketOrderSchedulesView);

var properties = new Properties(
  'BlanketOrderItemView',
  orderItemKey,
  orderItemCode,
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

//region Transfer object methods

function fromDto (ctx, dto) {
  ctx.setValue('orderItemKey',  dto.orderItemKey);
  ctx.setValue('orderKey',      dto.orderKey);
  ctx.setValue('productName',   dto.productName);
  ctx.setValue('obsolete',      dto.obsolete);
  ctx.setValue('expiry',        dto.expiry);
  ctx.setValue('quantity',      dto.quantity);
  ctx.setValue('unitPrice',     dto.unitPrice);
}

function toCto (ctx) {
  return {
    orderItemCode:  this.orderItemCode,
    productName:    this.productName,
    obsolete:       this.obsolete,
    expiry:         this.expiry,
    quantity:       this.quantity,
    unitPrice:      this.unitPrice
  };
}

//endregion

//region Data portal methods

function dataFetch (ctx, dto, method) {
  ctx.setValue('orderItemKey', dto.orderItemKey);
  ctx.setValue('orderKey',     dto.orderKey);
  ctx.setValue('productName',  dto.productName);
  ctx.setValue('obsolete',     dto.obsolete);
  ctx.setValue('expiry',       dto.expiry);
  ctx.setValue('quantity',     dto.quantity);
  ctx.setValue('unitPrice',    dto.unitPrice);
  return dto;
}

//endregion

var extensions = new Extensions('sync-dal', __filename);
extensions.daoBuilder = daoBuilder;
extensions.fromDto = fromDto;
extensions.toCto = toCto;
extensions.dataFetch = dataFetch;

var BlanketOrderItemView = bo.ReadOnlyChildModelSync(properties, rules, extensions);

module.exports = BlanketOrderItemView;
