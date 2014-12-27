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

var addressKey = new Property('addressKey', dt.Integer, F.key);
var orderKey = new Property('orderKey', dt.Integer, F.parentKey);
var country = new Property('country', dt.Text);
var state = new Property('state', dt.Text);
var city = new Property('city', dt.Text);
var line1 = new Property('line1', dt.Text);
var line2 = new Property('line2', dt.Text);
var postalCode = new Property('postalCode', dt.Text);

var properties = new Properties(
  'AddressView',
  addressKey,
  orderKey,
  country,
  state,
  city,
  line1,
  line2,
  postalCode
);

var rules = new Rules(
);

//region Transfer object methods

function fromDto (ctx, dto) {
  ctx.setValue('addressKey',  dto.addressKey);
  ctx.setValue('orderKey',    dto.orderKey);
  ctx.setValue('country',     dto.country);
  ctx.setValue('state',       dto.state);
  ctx.setValue('city',        dto.city);
  ctx.setValue('line1',       dto.line1);
  ctx.setValue('line2',       dto.line2);
  ctx.setValue('postalCode',  dto.postalCode);
}

function toCto (ctx) {
  return {
    addressKey:     this.addressKey,
    orderKey:   this.orderKey,
    country: this.country,
    state:   this.state,
    city:    this.city,
    line1:      this.line1,
    line2:  this.line2,
    postalCode: this.postalCode
  };
}

//endregion

//region Data portal methods

function dataFetch (ctx, dto, method, callback) {
  ctx.setValue('addressKey', dto.addressKey);
  ctx.setValue('orderKey',   dto.orderKey);
  ctx.setValue('country',    dto.country);
  ctx.setValue('state',      dto.state);
  ctx.setValue('city',       dto.city);
  ctx.setValue('line1',      dto.line1);
  ctx.setValue('line2',      dto.line2);
  ctx.setValue('postalCode', dto.postalCode);
  callback(null, dto);
}

//endregion

var extensions = new Extensions('async-dal', __filename);
extensions.daoBuilder = daoBuilder;
extensions.fromDto = fromDto;
extensions.toCto = toCto;
extensions.dataFetch = dataFetch;

var AddressView = bo.ReadOnlyModel(properties, rules, extensions);

module.exports = AddressView;
