'use strict';

var bo = require('../../source/index.js');
var daoBuilder = require('../dao-builder.js');

var Properties = bo.shared.PropertyManager;
var Rules = bo.rules.RuleManager;
var Action = bo.rules.AuthorizationAction;
var Extensions = bo.shared.ExtensionManagerSync;
var Property = bo.shared.PropertyInfo;
var F = bo.shared.PropertyFlag;
var dt = bo.dataTypes;
var cr = bo.commonRules;

var Address = require('./address.js');
var BlanketOrderItems = require('./blanket-order-items.js');

var orderKey = new Property('orderKey', dt.Integer, F.key | F.readOnly);
var vendorName = new Property('vendorName', dt.Text);
var contractDate = new Property('contractDate', dt.DateTime);
var totalPrice = new Property('totalPrice', dt.Decimal);
var schedules = new Property('schedules', dt.Integer);
var enabled = new Property('enabled', dt.Boolean);
var address = new Property('address', Address);
var items = new Property('items', BlanketOrderItems);
var createdDate = new Property('createdDate', dt.DateTime, F.readOnly);
var modifiedDate = new Property('modifiedDate', dt.DateTime, F.readOnly);

var properties = new Properties(
  'BlanketOrder',
  orderKey,
  vendorName,
  contractDate,
  totalPrice,
  schedules,
  enabled,
  address,
  items,
  createdDate,
  modifiedDate
);

var rules = new Rules(
  cr.required(vendorName),
  cr.required(contractDate),
  cr.required(totalPrice),
  cr.required(schedules),
  cr.required(enabled),
  cr.isInRole(Action.fetchObject, null, 'developers', 'You are not authorized to retrieve blanket order.'),
  cr.isInRole(Action.createObject, null, 'developers', 'You are not authorized to create blanket order.'),
  cr.isInRole(Action.updateObject, null, 'developers', 'You are not authorized to modify blanket order.'),
  cr.isInRole(Action.removeObject, null, 'developers', 'You are not authorized to delete blanket order.')
);

//region Transfer object methods

function toDto (ctx) {
  return {
    orderKey:     ctx.getValue('orderKey'),
    vendorName:   ctx.getValue('vendorName'),
    contractDate: ctx.getValue('contractDate'),
    totalPrice:   ctx.getValue('totalPrice'),
    schedules:    ctx.getValue('schedules'),
    enabled:      ctx.getValue('enabled'),
    createdDate:  ctx.getValue('createdDate'),
    modifiedDate: ctx.getValue('modifiedDate')
  };
}

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

function fromCto (ctx, dto) {
  //this.orderKey =     dto.orderKey;
  this.vendorName =   dto.vendorName;
  this.contractDate = dto.contractDate;
  this.totalPrice =   dto.totalPrice;
  this.schedules =    dto.schedules;
  this.enabled =      dto.enabled;
  //this.createdDate =  dto.createdDate;
  //this.modifiedDate = dto.modifiedDate;
}

//endregion

//region Data portal methods

function dataCreate (ctx) {
  var dto = ctx.dao.create();
  ctx.setValue('vendorName',   dto.vendorName);
  ctx.setValue('contractDate', dto.contractDate);
  ctx.setValue('totalPrice',   dto.totalPrice);
  ctx.setValue('schedules',    dto.schedules);
  ctx.setValue('enabled',      dto.enabled);
}

function dataFetch (ctx, filter, method) {
  var dto;
  if (method === 'fetchByName')
    // filter: vendorName
    dto = ctx.dao.fetchByName(filter);
  else
    // filter: primaryKey
    dto = ctx.dao.fetch(filter);
  // or:
  // var dto = ctx.dao[method](filter);
  ctx.setValue('orderKey',     dto.orderKey);
  ctx.setValue('vendorName',   dto.vendorName);
  ctx.setValue('contractDate', dto.contractDate);
  ctx.setValue('totalPrice',   dto.totalPrice);
  ctx.setValue('schedules',    dto.schedules);
  ctx.setValue('enabled',      dto.enabled);
  ctx.setValue('createdDate',  dto.createdDate);
  ctx.setValue('modifiedDate', dto.modifiedDate);
  return dto;
}

function dataInsert (ctx) {
  var dto = {
    vendorName:   ctx.getValue('vendorName'),
    contractDate: ctx.getValue('contractDate'),
    totalPrice:   ctx.getValue('totalPrice'),
    schedules:    ctx.getValue('schedules'),
    enabled:      ctx.getValue('enabled')
  };
  dto = ctx.dao.insert(dto);
  ctx.setValue('orderKey',     dto.orderKey);
  ctx.setValue('createdDate',  dto.createdDate);
}

function dataUpdate (ctx) {
  if (ctx.isSelfDirty) {
    var dto = {
      orderKey:     ctx.getValue('orderKey'),
      vendorName:   ctx.getValue('vendorName'),
      contractDate: ctx.getValue('contractDate'),
      totalPrice:   ctx.getValue('totalPrice'),
      schedules:    ctx.getValue('schedules'),
      enabled:      ctx.getValue('enabled')
    };
    dto = ctx.dao.update(dto);
    ctx.setValue('modifiedDate', dto.modifiedDate);
  }
}

function dataRemove (ctx) {
  var primaryKey = ctx.getValue('orderKey');
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

var BlanketOrder = bo.EditableRootModelSync(properties, rules, extensions);

var BlanketOrderFactory = {
  create: function () {
    return BlanketOrder.create();
  },
  get: function (key) {
    return BlanketOrder.fetch(key);
  },
  getByName: function (name) {
    return BlanketOrder.fetch(name, 'fetchByName');
  }
};

module.exports = BlanketOrderFactory;
