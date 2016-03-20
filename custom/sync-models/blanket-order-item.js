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

function getItemCode (ctx) {
  return ctx.getValue('orderItemKey').toString(2);
}

var orderItemKey = new Property('orderItemKey', dt.Integer, F.key | F.readOnly | F.notOnCto);
var orderItemCode = new Property('orderItemCode', dt.Integer, F.readOnly | F.notOnDto, getItemCode);
var orderKey = new Property('orderKey', dt.Integer, F.parentKey | F.readOnly | F.notOnCto);
var productName = new Property('productName', dt.Text);
var obsolete = new Property('obsolete', dt.Boolean);
var expiry = new Property('expiry', dt.DateTime);
var quantity = new Property('quantity', dt.Integer);
var unitPrice = new Property('unitPrice', dt.Decimal);
var schedules = new Property('schedules', BlanketOrderSchedules);

var properties = new Properties(
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
    orderItemCode:  this.orderItemCode,
    productName:    this.productName,
    obsolete:       this.obsolete,
    expiry:         this.expiry,
    quantity:       this.quantity,
    unitPrice:      this.unitPrice
  };
}

function fromCto (ctx, cto) {
  //this.orderItemKey =  cto.orderItemKey;
  //this.orderItemCode = cto.orderItemCode;
  //this.orderKey =      cto.orderKey;
  this.productName =   cto.productName;
  this.obsolete =      cto.obsolete;
  this.expiry =        cto.expiry;
  this.quantity =      cto.quantity;
  this.unitPrice =     cto.unitPrice;
}

//endregion

//region Data portal methods

function dataCreate (ctx) {
  var dto = ctx.dao.create(ctx.connection);
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
  dto = ctx.dao.insert(ctx.connection, dto);
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
    dto = ctx.dao.update(ctx.connection, dto);
  }
}

function dataRemove (ctx) {
  var primaryKey = ctx.getValue('orderItemKey');
  ctx.dao.remove(ctx.connection, primaryKey);
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

var BlanketOrderItem = bo.EditableChildModelSync('BlanketOrderItem', properties, rules, extensions);

module.exports = BlanketOrderItem;
