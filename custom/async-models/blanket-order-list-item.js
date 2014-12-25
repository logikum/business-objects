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

var orderKey = new Property('orderKey', dt.Integer, F.key);
var vendorName = new Property('vendorName', dt.Text);
var contractDate = new Property('contractDate', dt.DateTime);
var totalPrice = new Property('totalPrice', dt.Decimal);
var schedules = new Property('schedules', dt.Integer);
var enabled = new Property('enabled', dt.Boolean);
var createdDate = new Property('createdDate', dt.DateTime);
var modifiedDate = new Property('modifiedDate', dt.DateTime);

var properties = new Properties(
  'BlanketOrderListItem',
  orderKey,
  vendorName,
  contractDate,
  totalPrice,
  schedules,
  enabled,
  createdDate,
  modifiedDate
);

var rules = new Rules(
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

var extensions = new Extensions('async-dal', __filename);
extensions.daoBuilder = daoBuilder;
extensions.fromDto = fromDto;
extensions.toCto = toCto;

var BlanketOrderListItem = bo.ReadOnlyModel(properties, rules, extensions);

module.exports = BlanketOrderListItem;
