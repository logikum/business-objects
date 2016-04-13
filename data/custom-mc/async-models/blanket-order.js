'use strict';

var bo = require('../../../source/index.js');
var daoBuilder = require('../dao-builder.js');
var Model = bo.ModelComposer;
var F = bo.shared.PropertyFlag;
var cr = bo.commonRules;

var Address = require('./address.js');
var BlanketOrderItems = require('./blanket-order-items.js');

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

function dataCreate (ctx, callback) {
  ctx.dao.create(ctx.connection, function (err, dto) {
    if (err)
      callback(err);
    else {
      ctx.setValue('vendorName',   dto.vendorName);
      ctx.setValue('contractDate', dto.contractDate);
      ctx.setValue('totalPrice',   dto.totalPrice);
      ctx.setValue('schedules',    dto.schedules);
      ctx.setValue('enabled',      dto.enabled);
      callback(null);
    }
  });
}

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

function dataInsert (ctx, callback) {
  var dto = {
    vendorName:   ctx.getValue('vendorName'),
    contractDate: ctx.getValue('contractDate'),
    totalPrice:   ctx.getValue('totalPrice'),
    schedules:    ctx.getValue('schedules'),
    enabled:      ctx.getValue('enabled')
  };
  ctx.dao.insert(ctx.connection, dto, function (err, dto) {
    if (err)
      callback(err);
    else {
      ctx.setValue('orderKey', dto.orderKey);
      ctx.setValue('createdDate', dto.createdDate);
      callback(null);
    }
  });
}

function dataUpdate (ctx, callback) {
  if (ctx.isSelfDirty) {
    var dto = {
      orderKey:     ctx.getValue('orderKey'),
      vendorName:   ctx.getValue('vendorName'),
      contractDate: ctx.getValue('contractDate'),
      totalPrice:   ctx.getValue('totalPrice'),
      schedules:    ctx.getValue('schedules'),
      enabled:      ctx.getValue('enabled')
    };
    ctx.dao.update(ctx.connection, dto, function (err, dto) {
      if (err)
        callback(err);
      else {
        ctx.setValue('modifiedDate', dto.modifiedDate);
        callback(null);
      }
    });
  }
}

function dataRemove (ctx, callback) {
  var primaryKey = ctx.getValue('orderKey');
  ctx.dao.remove(ctx.connection, primaryKey, function (err) {
    if (err)
      callback(err);
    else
      callback(null);
  });
}

//endregion

var BlanketOrder = Model('BlanketOrder')
    .editableRootObject('async-dal', __filename)
    // --- Properties
    .integer('orderKey', F.key | F.readOnly)
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
  get: function (key, eventHandlers) {
    return BlanketOrder.fetch(key, null, eventHandlers);
  },
  getByName: function (name, eventHandlers) {
    return BlanketOrder.fetch(name, 'fetchByName', eventHandlers);
  }
};

module.exports = BlanketOrderFactory;
