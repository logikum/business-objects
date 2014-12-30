'use strict';

var bo = require('../../source/index.js');
var daoBuilder = require('../dao-builder.js');

var Properties = bo.shared.PropertyManager;
var Rules = bo.rules.RuleManager;
var Extensions = bo.shared.ExtensionManagerSync;
var Property = bo.shared.PropertyInfo;
//var F = bo.shared.PropertyFlag;
var dt = bo.dataTypes;
var cr = bo.commonRules;

var quantity = new Property('quantity', dt.Integer);
var totalMass = new Property('totalMass', dt.Decimal);
var required = new Property('required', dt.Boolean);
var shipTo = new Property('shipTo', dt.Text);
var shipDate = new Property('shipDate', dt.DateTime);

var properties = new Properties(
    'RescheduleShippingResult',
    quantity,
    totalMass,
    required,
    shipTo,
    shipDate
);

var rules = new Rules(
    cr.required(quantity),
    cr.required(totalMass),
    cr.required(required),
    cr.required(shipTo),
    cr.required(shipDate)
);

//region Data portal methods

function dataFetch (ctx, dto, method) {
  ctx.setValue('quantity',  dto.quantity);
  ctx.setValue('totalMass', dto.totalMass);
  ctx.setValue('required',  dto.required);
  ctx.setValue('shipTo',    dto.shipTo);
  ctx.setValue('shipDate',  dto.shipDate);
  return dto;
}

//endregion

var extensions = new Extensions('sync-dal', __filename);
extensions.daoBuilder = daoBuilder;
extensions.dataFetch = dataFetch;

var RescheduleShippingResult = bo.ReadOnlyChildModelSync(properties, rules, extensions);

module.exports = RescheduleShippingResult;
