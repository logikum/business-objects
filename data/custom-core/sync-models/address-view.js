'use strict';

var bo = require('../../../source/index.js');
var daoBuilder = require('../dao-builder.js');

var Properties = bo.shared.PropertyManager;
var Rules = bo.rules.RuleManager;
var Extensions = bo.shared.ExtensionManagerSync;
var Property = bo.shared.PropertyInfo;
var F = bo.shared.PropertyFlag;
var dt = bo.dataTypes;
var cr = bo.commonRules;

function getAddressCode (ctx) {
  return ctx.getValue('addressKey').toString(2);
}

var addressKey = new Property('addressKey', dt.Integer, F.key | F.onDtoOnly);
var addressCode = new Property('addressCode', dt.Text, F.onCtoOnly, getAddressCode);
var orderKey = new Property('orderKey', dt.Integer, F.parentKey | F.onDtoOnly);
var country = new Property('country', dt.Text);
var state = new Property('state', dt.Text);
var city = new Property('city', dt.Text);
var line1 = new Property('line1', dt.Text);
var line2 = new Property('line2', dt.Text);
var postalCode = new Property('postalCode', dt.Text);

var properties = new Properties(
    addressKey,
    addressCode,
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
    addressCode: this.addressCode,
    country:     this.country,
    state:       this.state,
    city:        this.city,
    line1:       this.line1,
    line2:       this.line2,
    postalCode:  this.postalCode
  };
}

//endregion

//region Data portal methods

function dataFetch (ctx, dto, method) {
  ctx.setValue('addressKey', dto.addressKey);
  ctx.setValue('orderKey',   dto.orderKey);
  ctx.setValue('country',    dto.country);
  ctx.setValue('state',      dto.state);
  ctx.setValue('city',       dto.city);
  ctx.setValue('line1',      dto.line1);
  ctx.setValue('line2',      dto.line2);
  ctx.setValue('postalCode', dto.postalCode);
  return dto;
}

//endregion

var extensions = new Extensions('sync-dal', __filename);
extensions.daoBuilder = daoBuilder;
extensions.fromDto = fromDto;
extensions.toCto = toCto;
extensions.dataFetch = dataFetch;

var AddressView = bo.ReadOnlyChildObjectSync('AddressView', properties, rules, extensions);

module.exports = AddressView;
