'use strict';

var bo = require('../../../source/index.js');
var daoBuilder = require('../dao-builder.js');
var Model = bo.ModelComposerSync;
var F = bo.shared.PropertyFlag;
var cr = bo.commonRules;

var Address = require('./address.js');
var BlanketOrderItems = require('./blanket-order-items.js');

//region Property methods

function getOrderCode (ctx) {
  return ctx.getValue('orderKey').toString(2);
}

//endregion

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
    orderCode:    this.orderCode,
    vendorName:   this.vendorName,
    contractDate: this.contractDate,
    totalPrice:   this.totalPrice,
    schedules:    this.schedules,
    enabled:      this.enabled,
    createdDate:  this.createdDate,
    modifiedDate: this.modifiedDate
  };
}

function fromCto (ctx, cto) {
  //this.orderKey =     cto.orderKey;
  //this.orderCode =    cto.orderCode;
  this.vendorName =   cto.vendorName;
  this.contractDate = cto.contractDate;
  this.totalPrice =   cto.totalPrice;
  this.schedules =    cto.schedules;
  this.enabled =      cto.enabled;
  //this.createdDate =  cto.createdDate;
  //this.modifiedDate = cto.modifiedDate;
}

//endregion

//region Data portal methods

function dataCreate (ctx) {
  var dto = ctx.dao.create(ctx.connection);
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
    dto = ctx.dao.fetchByName(ctx.connection, filter);
  else
  // filter: primaryKey encoded
    dto = ctx.dao.fetch(ctx.connection, filter);
  // or:
  // var dto = ctx.dao[method](ctx.connection, filter);
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
  dto = ctx.dao.insert(ctx.connection, dto);
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
    dto = ctx.dao.update(ctx.connection, dto);
    ctx.setValue('modifiedDate', dto.modifiedDate);
  }
}

function dataRemove (ctx) {
  var primaryKey = ctx.getValue('orderKey');
  ctx.dao.remove(ctx.connection, primaryKey);
}

//endregion

var BlanketOrder = Model('BlanketOrder')
    .editableRootModel('sync-dal', __filename)
    // --- Properties
    .integer('orderKey', F.key | F.readOnly | F.onDtoOnly)
    .text('orderCode', F.readOnly | F.onCtoOnly, getOrderCode)
    .text('vendorName')
        .required()
    .dateTime('contractDate')
        .required()
    .decimal('totalPrice')
        .required()
    .integer('schedules')
        .required()
    .boolean('enabled')
        .required()
    .property('address', Address)
    .property('items', BlanketOrderItems)
    .dateTime('createdDate', F.readOnly)
    .dateTime('modifiedDate', F.readOnly)
    // --- Permissions
    .canFetch(cr.isInRole, 'developers', 'You are not authorized to retrieve blanket order.')
    .canCreate(cr.isInRole, 'developers', 'You are not authorized to create blanket order.')
    .canUpdate(cr.isInRole, 'developers', 'You are not authorized to modify blanket order.')
    .canRemove(cr.isInRole, 'developers', 'You are not authorized to delete blanket order.')
    // --- Customization
    .daoBuilder(daoBuilder)
    .toDto(toDto)
    .fromDto(fromDto)
    .toCto(toCto)
    .fromCto(fromCto)
    .dataCreate(dataCreate)
    .dataFetch(dataFetch)
    .dataInsert(dataInsert)
    .dataUpdate(dataUpdate)
    .dataRemove(dataRemove)
    // --- Build model class
    .compose();

var BlanketOrderFactory = {
  create: function (eventHandlers) {
    return BlanketOrder.create(eventHandlers);
  },
  get: function (code, eventHandlers) {
    return BlanketOrder.fetch(code, null, eventHandlers);
  },
  getByName: function (name, eventHandlers) {
    return BlanketOrder.fetch(name, 'fetchByName', eventHandlers);
  }
};

module.exports = BlanketOrderFactory;
