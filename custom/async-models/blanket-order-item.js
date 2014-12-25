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

var extensions = new Extensions('async-dal', __filename);
extensions.daoBuilder = daoBuilder;
extensions.toDto = toDto;
extensions.fromDto = fromDto;
extensions.toCto = toCto;
extensions.fromCto = fromCto;

var BlanketOrderItem = bo.EditableModel(properties, rules, extensions);

module.exports = BlanketOrderItem;
