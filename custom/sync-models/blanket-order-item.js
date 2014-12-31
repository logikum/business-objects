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

//region Transfer object methods

function toDto (ctx) {
  return {
    orderItemKey: ctx.getValue('orderItemKey'),
    orderKey:     ctx.getValue('orderKey'),
    productName:  ctx.getValue('productName'),
    obsolete:     ctx.getValue('obsolete'),
    expiry:       ctx.getValue('expiry'),
    quantity:     ctx.getValue('quantity'),
    unitPrice:    ctx.getValue('unitPrice')
  };
}

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
    orderItemKey:     this.orderItemKey,
    orderKey:   this.orderKey,
    productName: this.productName,
    obsolete:   this.obsolete,
    expiry:    this.expiry,
    quantity:      this.quantity,
    unitPrice: this.unitPrice
  };
}

function fromCto (ctx, dto) {
  this.orderItemKey = dto.orderItemKey;
  this.orderKey =     dto.orderKey;
  this.productName =  dto.productName;
  this.obsolete =     dto.obsolete;
  this.expiry =       dto.expiry;
  this.quantity =     dto.quantity;
  this.unitPrice =    dto.unitPrice;
}

//endregion

//region Data portal methods

function dataCreate (ctx) {
  var dto = ctx.dao.create();
  ctx.setValue('productName', dto.productName);
  ctx.setValue('obsolete',    dto.obsolete);
  ctx.setValue('expiry',      dto.expiry);
  ctx.setValue('quantity',    dto.quantity);
  ctx.setValue('unitPrice',   dto.unitPrice);
}

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

function dataInsert (ctx) {
  var dto = {
    orderKey:     ctx.getValue('orderKey'),
    productName:  ctx.getValue('productName'),
    obsolete:     ctx.getValue('obsolete'),
    expiry:       ctx.getValue('expiry'),
    quantity:     ctx.getValue('quantity'),
    unitPrice:    ctx.getValue('unitPrice')
  };
  dto = ctx.dao.insert(dto);
  ctx.setValue('orderItemKey', dto.orderItemKey);
}

function dataUpdate (ctx) {
  if (ctx.isSelfDirty) {
    var dto = {
      orderItemKey: ctx.getValue('orderItemKey'),
      productName:  ctx.getValue('productName'),
      obsolete:     ctx.getValue('obsolete'),
      expiry:       ctx.getValue('expiry'),
      quantity:     ctx.getValue('quantity'),
      unitPrice:    ctx.getValue('unitPrice')
    };
    dto = ctx.dao.update(dto);
  }
}

function dataRemove (ctx) {
  var primaryKey = ctx.getValue('orderItemKey');
  ctx.dao.remove(primaryKey);
}

//endregion

var extensions = new Extensions('sync-dal', __filename);
extensions.daoBuilder = daoBuilder;
extensions.toDto = toDto;
extensions.fromDto = fromDto;
extensions.toCto = toCto;
extensions.fromCto = fromCto;
extensions.dataCreate = dataCreate;
extensions.dataFetch = dataFetch;
extensions.dataInsert = dataInsert;
extensions.dataUpdate = dataUpdate;
extensions.dataRemove = dataRemove;

var BlanketOrderItem = bo.EditableChildModelSync(properties, rules, extensions);

module.exports = BlanketOrderItem;
