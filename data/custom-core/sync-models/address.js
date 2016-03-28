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

var addressKey = new Property('addressKey', dt.Integer, F.key | F.readOnly | F.onDtoOnly);
var addressCode = new Property('addressCode', dt.Text, F.readOnly | F.onCtoOnly, getAddressCode);
var orderKey = new Property('orderKey', dt.Integer, F.parentKey | F.readOnly | F.onDtoOnly);
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
    cr.required(country),
    cr.required(city),
    cr.required(line1),
    cr.required(postalCode)
);

//region Transfer object methods

function toDto (ctx) {
  return {
    addressKey: ctx.getValue('addressKey'),
    orderKey:   ctx.getValue('orderKey'),
    country:    ctx.getValue('country'),
    state:      ctx.getValue('state'),
    city:       ctx.getValue('city'),
    line1:      ctx.getValue('line1'),
    line2:      ctx.getValue('line2'),
    postalCode: ctx.getValue('postalCode')
  };
}

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

function fromCto (ctx, cto) {
  //this.addressKey =  cto.addressKey;
  //this.addressCode = cto.addressCode;
  //this.orderKey =    cto.orderKey;
  this.country =     cto.country;
  this.state =       cto.state;
  this.city =        cto.city;
  this.line1 =       cto.line1;
  this.line2 =       cto.line2;
  this.postalCode =  cto.postalCode;
}

//endregion

//region Data portal methods

function dataCreate (ctx) {
  var dto = ctx.dao.create(ctx.connection);
  ctx.setValue('country',    dto.country);
  ctx.setValue('state',      dto.state);
  ctx.setValue('city',       dto.city);
  ctx.setValue('line1',      dto.line1);
  ctx.setValue('line2',      dto.line2);
  ctx.setValue('postalCode', dto.postalCode);
}

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

function dataInsert (ctx) {
  var dto = {
    orderKey:   ctx.getValue('orderKey'),
    country:    ctx.getValue('country'),
    state:      ctx.getValue('state'),
    city:       ctx.getValue('city'),
    line1:      ctx.getValue('line1'),
    line2:      ctx.getValue('line2'),
    postalCode: ctx.getValue('postalCode')
  };
  dto = ctx.dao.insert(ctx.connection, dto);
  ctx.setValue('addressKey', dto.addressKey);
}

function dataUpdate (ctx) {
  if (ctx.isSelfDirty) {
    var dto = {
      addressKey: ctx.getValue('addressKey'),
      country:    ctx.getValue('country'),
      state:      ctx.getValue('state'),
      city:       ctx.getValue('city'),
      line1:      ctx.getValue('line1'),
      line2:      ctx.getValue('line2'),
      postalCode: ctx.getValue('postalCode')
    };
    dto = ctx.dao.update(ctx.connection, dto);
  }
}

function dataRemove (ctx) {
  var primaryKey = ctx.getValue('addressKey');
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

var Address = bo.EditableChildModelSync('Address', properties, rules, extensions);

module.exports = Address;
