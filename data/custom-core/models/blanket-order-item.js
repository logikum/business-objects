'use strict';

var bo = require('../../../source/index.js');
var daoBuilder = require('../dao-builder.js');

var Properties = bo.shared.PropertyManager;
var Rules = bo.rules.RuleManager;
var Extensions = bo.shared.ExtensionManager;
var Property = bo.shared.PropertyInfo;
var F = bo.shared.PropertyFlag;
var dt = bo.dataTypes;
var cr = bo.commonRules;

var BlanketOrderSchedules = require('./blanket-order-schedules.js');

var orderItemKey = new Property( 'orderItemKey', dt.Integer, F.key | F.readOnly );
var orderKey = new Property( 'orderKey', dt.Integer, F.parentKey | F.readOnly );
var productName = new Property( 'productName', dt.Text );
var obsolete = new Property( 'obsolete', dt.Boolean );
var expiry = new Property( 'expiry', dt.DateTime );
var quantity = new Property( 'quantity', dt.Integer );
var unitPrice = new Property( 'unitPrice', dt.Decimal );
var schedules = new Property( 'schedules', BlanketOrderSchedules );

var properties = new Properties(
    orderItemKey,
    orderKey,
    productName,
    obsolete,
    expiry,
    quantity,
    unitPrice,
    schedules
);

var rules = new Rules(
    cr.required( productName ),
    cr.required( obsolete ),
    cr.required( expiry ),
    cr.required( quantity ),
    cr.required( unitPrice )
);

//region Transfer object methods

function toDto( ctx ) {
  return {
    orderItemKey: ctx.getValue( 'orderItemKey' ),
    orderKey:     ctx.getValue( 'orderKey' ),
    productName:  ctx.getValue( 'productName' ),
    obsolete:     ctx.getValue( 'obsolete' ),
    expiry:       ctx.getValue( 'expiry' ),
    quantity:     ctx.getValue( 'quantity' ),
    unitPrice:    ctx.getValue( 'unitPrice' )
  };
}

function fromDto( ctx, dto ) {
  ctx.setValue( 'orderItemKey',  dto.orderItemKey );
  ctx.setValue( 'orderKey',      dto.orderKey );
  ctx.setValue( 'productName',   dto.productName );
  ctx.setValue( 'obsolete',      dto.obsolete );
  ctx.setValue( 'expiry',        dto.expiry );
  ctx.setValue( 'quantity',      dto.quantity );
  ctx.setValue( 'unitPrice',     dto.unitPrice );
}

function toCto( ctx ) {
  return {
    orderItemKey: this.orderItemKey,
    orderKey:     this.orderKey,
    productName:  this.productName,
    obsolete:     this.obsolete,
    expiry:       this.expiry,
    quantity:     this.quantity,
    unitPrice:    this.unitPrice
   };
}

function fromCto( ctx, cto ) {
//this.orderItemKey = cto.orderItemKey;
//this.orderKey =     cto.orderKey;
  this.productName =  cto.productName;
  this.obsolete =     cto.obsolete;
  this.expiry =       cto.expiry;
  this.quantity =     cto.quantity;
  this.unitPrice =    cto.unitPrice;
}

//endregion

//region Data portal methods

function dataCreate( ctx ) {
  ctx.create().then( dto => {
    ctx.setValue( 'productName', dto.productName );
    ctx.setValue( 'obsolete',    dto.obsolete );
    ctx.setValue( 'expiry',      dto.expiry );
    ctx.setValue( 'quantity',    dto.quantity );
    ctx.setValue( 'unitPrice',   dto.unitPrice );
    ctx.fulfill( null );
  });
}

function dataFetch( ctx, dto, method ) {
  ctx.setValue( 'orderItemKey', dto.orderItemKey );
  ctx.setValue( 'orderKey',     dto.orderKey );
  ctx.setValue( 'productName',  dto.productName );
  ctx.setValue( 'obsolete',     dto.obsolete );
  ctx.setValue( 'expiry',       dto.expiry );
  ctx.setValue( 'quantity',     dto.quantity );
  ctx.setValue( 'unitPrice',    dto.unitPrice );
  ctx.fulfill( dto );
}

function dataInsert( ctx ) {
  var dto = {
    orderKey:     ctx.getValue( 'orderKey' ),
    productName:  ctx.getValue( 'productName' ),
    obsolete:     ctx.getValue( 'obsolete' ),
    expiry:       ctx.getValue( 'expiry' ),
    quantity:     ctx.getValue( 'quantity' ),
    unitPrice:    ctx.getValue( 'unitPrice' )
  };
  ctx.insert( dto ).then( dto => {
    ctx.setValue( 'orderItemKey', dto.orderItemKey );
    ctx.fulfill( null );
  });
}

function dataUpdate( ctx ) {
  if (ctx.isSelfDirty) {
    var dto = {
      orderItemKey: ctx.getValue( 'orderItemKey' ),
      productName:  ctx.getValue( 'productName' ),
      obsolete:     ctx.getValue( 'obsolete' ),
      expiry:       ctx.getValue( 'expiry' ),
      quantity:     ctx.getValue( 'quantity' ),
      unitPrice:    ctx.getValue( 'unitPrice' )
    };
    ctx.update( dto ).then( dto => {
      ctx.fulfill( null );
    });
  }
}

function dataRemove( ctx ) {
  var primaryKey = ctx.getValue( 'orderItemKey' );
  ctx.remove( primaryKey ).then( dto => {
    ctx.fulfill( null );
  });
}

//endregion

var extensions = new Extensions( 'dal', __filename );
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

var BlanketOrderItem = bo.EditableChildObject( 'BlanketOrderItem', properties, rules, extensions );

module.exports = BlanketOrderItem;
