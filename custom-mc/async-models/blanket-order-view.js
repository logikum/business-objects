'use strict';

var bo = require('../../source/index.js');
var daoBuilder = require('../dao-builder.js');
var Model = bo.ModelComposer;
var F = bo.shared.PropertyFlag;
var cr = bo.commonRules;

var AddressView = require('./address-view.js');
var BlanketOrderItemsView = require('./blanket-order-items-view.js');

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

//region Data portal methods

function dataFetch (ctx, filter, method, callback) {
  function cb (err, dto) {
    if (err)
      callback(err);
    else {
      ctx.setValue('orderKey',     dto.orderKey);
      ctx.setValue('vendorName',   dto.vendorName);
      ctx.setValue('contractDate', dto.contractDate);
      ctx.setValue('totalPrice',   dto.totalPrice);
      ctx.setValue('schedules',    dto.schedules);
      ctx.setValue('enabled',      dto.enabled);
      ctx.setValue('createdDate',  dto.createdDate);
      ctx.setValue('modifiedDate', dto.modifiedDate);
      callback(null, dto);
    }
  }
  if (method === 'fetchByName') {
    // filter: vendorName
    ctx.dao.fetchByName(ctx.connection, filter, cb);
  } else {
    // filter: primaryKey
    ctx.dao.fetch(ctx.connection, filter, cb);
  }
  // or:
  // ctx.dao[method](ctx.connection, filter, cb);
}

//endregion

var BlanketOrderView = Model('BlanketOrderView').readOnlyRootModel('async-dal', __filename)
    .integer('orderKey', F.key)
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
  get: function (key, eventHandlers, callback) {
    BlanketOrderView.fetch(key, null, eventHandlers, callback);
  },
  getByName: function (name, eventHandlers, callback) {
    BlanketOrderView.fetch(name, 'fetchByName', eventHandlers, callback);
  }
};

module.exports = BlanketOrderViewFactory;
