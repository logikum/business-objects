'use strict';

var bo = require('../../../source/index.js');

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

//region Transfer object methods

function fromDto (ctx, dto) {
  ctx.setValue('orderScheduleKey',  dto.orderScheduleKey);
  ctx.setValue('orderItemKey',      dto.orderItemKey);
  ctx.setValue('quantity',          dto.quantity);
  ctx.setValue('totalMass',         dto.totalMass);
  ctx.setValue('required',          dto.required);
  ctx.setValue('shipTo',            dto.shipTo);
  ctx.setValue('shipDate',          dto.shipDate);
}

function toCto (ctx) {
  return {
    orderScheduleKey: this.orderScheduleKey,
    orderItemKey:     this.orderItemKey,
    quantity:         this.quantity,
    totalMass:        this.totalMass,
    required:         this.required,
    shipTo:           this.shipTo,
    shipDate:         this.shipDate
  };
}

//endregion

//region Data portal methods

function dataFetch (ctx, dto, method, callback) {
  ctx.setValue('orderScheduleKey', dto.orderScheduleKey);
  ctx.setValue('orderItemKey',     dto.orderItemKey);
  ctx.setValue('quantity',         dto.quantity);
  ctx.setValue('totalMass',        dto.totalMass);
  ctx.setValue('required',         dto.required);
  ctx.setValue('shipTo',           dto.shipTo);
  ctx.setValue('shipDate',         dto.shipDate);
  callback(null, dto);
}

//endregion

var extensions = new Extensions('async-dal', __filename);
extensions.fromDto = fromDto;
extensions.toCto = toCto;
extensions.dataFetch = dataFetch;

var BlanketOrderScheduleView = bo.ReadOnlyChildObject('BlanketOrderScheduleView', properties, rules, extensions);

module.exports = BlanketOrderScheduleView;