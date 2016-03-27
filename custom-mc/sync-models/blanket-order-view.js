'use strict';

var bo = require('../../source/index.js');
var daoBuilder = require('../dao-builder.js');
var Model = bo.ModelComposerSync;
var F = bo.shared.PropertyFlag;
var cr = bo.commonRules;

var AddressView = require('./address-view.js');
var BlanketOrderItemsView = require('./blanket-order-items-view.js');

//region Property methods

function getOrderCode (ctx) {
  return ctx.getValue('orderKey').toString(2);
}

//endregion

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

//endregion

//region Data portal methods

function dataFetch (ctx, filter, method) {
  var dto;
  if (method === 'fetchByName')
  // filter: vendorName
    dto = ctx.dao.fetchByName(ctx.connection, filter);
  else
  // filter: primaryKey
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

//endregion

var BlanketOrderView = Model('BlanketOrderView').readOnlyRootModel('sync-dal', __filename)
    .integer('orderKey', F.key | F.onDtoOnly)
    .text('orderCode', F.onCtoOnly, getOrderCode)
    .text('vendorName')
    .dateTime('contractDate')
    .decimal('totalPrice')
        .canRead(cr.isInAnyRole, ['salesmen', 'administrators'], 'You are not authorized to view the totalPrice of the blanket order.')
    .integer('schedules')
    .boolean('enabled')
    .property('address', AddressView)
    .property('items', BlanketOrderItemsView)
    .dateTime('createdDate')
    .dateTime('modifiedDate')
    .canFetch(cr.isInRole, 'designers', 'You are not authorized to retrieve blanket order.')
    .daoBuilder(daoBuilder)
    .fromDto(fromDto)
    .toCto(toCto)
    .dataFetch(dataFetch)
    .compose();

var BlanketOrderViewFactory = {
  get: function (key, eventHandlers) {
    return BlanketOrderView.fetch(key, null, eventHandlers);
  },
  getByName: function (name, eventHandlers) {
    return BlanketOrderView.fetch(name, 'fetchByName', eventHandlers);
  }
};

module.exports = BlanketOrderViewFactory;
