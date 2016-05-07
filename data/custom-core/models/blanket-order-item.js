'use strict';

const bo = require( '../../../source/index.js' );
const daoBuilder = require( '../dao-builder.js' );

const Properties = bo.shared.PropertyManager;
const Rules = bo.rules.RuleManager;
const Extensions = bo.shared.ExtensionManager;
const Property = bo.shared.PropertyInfo;
const F = bo.shared.PropertyFlag;
const dt = bo.dataTypes;
const cr = bo.commonRules;

const BlanketOrderSchedules = require( './blanket-order-schedules.js' );

const orderItemKey = new Property( 'orderItemKey', dt.Integer, F.key | F.readOnly );
const orderKey = new Property( 'orderKey', dt.Integer, F.parentKey | F.readOnly );
const productName = new Property( 'productName', dt.Text );
const obsolete = new Property( 'obsolete', dt.Boolean );
const expiry = new Property( 'expiry', dt.DateTime );
const quantity = new Property( 'quantity', dt.Integer );
const unitPrice = new Property( 'unitPrice', dt.Decimal );
const schedules = new Property( 'schedules', BlanketOrderSchedules );

const properties = new Properties(
  orderItemKey,
  orderKey,
  productName,
  obsolete,
  expiry,
  quantity,
  unitPrice,
  schedules
);

const rules = new Rules(
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
    orderKey: ctx.getValue( 'orderKey' ),
    productName: ctx.getValue( 'productName' ),
    obsolete: ctx.getValue( 'obsolete' ),
    expiry: ctx.getValue( 'expiry' ),
    quantity: ctx.getValue( 'quantity' ),
    unitPrice: ctx.getValue( 'unitPrice' )
  };
}

function fromDto( ctx, dto ) {
  ctx.setValue( 'orderItemKey', dto.orderItemKey );
  ctx.setValue( 'orderKey', dto.orderKey );
  ctx.setValue( 'productName', dto.productName );
  ctx.setValue( 'obsolete', dto.obsolete );
  ctx.setValue( 'expiry', dto.expiry );
  ctx.setValue( 'quantity', dto.quantity );
  ctx.setValue( 'unitPrice', dto.unitPrice );
}

function toCto( ctx ) {
  return {
    orderItemKey: this.orderItemKey,
    orderKey: this.orderKey,
    productName: this.productName,
    obsolete: this.obsolete,
    expiry: this.expiry,
    quantity: this.quantity,
    unitPrice: this.unitPrice
  };
}

function fromCto( ctx, cto ) {
//this.orderItemKey = cto.orderItemKey;
//this.orderKey =     cto.orderKey;
  this.productName = cto.productName;
  this.obsolete = cto.obsolete;
  this.expiry = cto.expiry;
  this.quantity = cto.quantity;
  this.unitPrice = cto.unitPrice;
}

//endregion

//region Data portal methods

function dataCreate( ctx ) {
  ctx.create().then( dto => {
    ctx.setValue( 'productName', dto.productName );
    ctx.setValue( 'obsolete', dto.obsolete );
    ctx.setValue( 'expiry', dto.expiry );
    ctx.setValue( 'quantity', dto.quantity );
    ctx.setValue( 'unitPrice', dto.unitPrice );
    ctx.fulfill( null );
  } );
}

function dataFetch( ctx, dto, method ) {
  ctx.setValue( 'orderItemKey', dto.orderItemKey );
  ctx.setValue( 'orderKey', dto.orderKey );
  ctx.setValue( 'productName', dto.productName );
  ctx.setValue( 'obsolete', dto.obsolete );
  ctx.setValue( 'expiry', dto.expiry );
  ctx.setValue( 'quantity', dto.quantity );
  ctx.setValue( 'unitPrice', dto.unitPrice );
  ctx.fulfill( dto );
}

function dataInsert( ctx ) {
  const dto = {
    orderKey: ctx.getValue( 'orderKey' ),
    productName: ctx.getValue( 'productName' ),
    obsolete: ctx.getValue( 'obsolete' ),
    expiry: ctx.getValue( 'expiry' ),
    quantity: ctx.getValue( 'quantity' ),
    unitPrice: ctx.getValue( 'unitPrice' )
  };
  ctx.insert( dto ).then( dto => {
    ctx.setValue( 'orderItemKey', dto.orderItemKey );
    ctx.fulfill( null );
  } );
}

function dataUpdate( ctx ) {
  if (ctx.isSelfDirty) {
    const dto = {
      orderItemKey: ctx.getValue( 'orderItemKey' ),
      productName: ctx.getValue( 'productName' ),
      obsolete: ctx.getValue( 'obsolete' ),
      expiry: ctx.getValue( 'expiry' ),
      quantity: ctx.getValue( 'quantity' ),
      unitPrice: ctx.getValue( 'unitPrice' )
    };
    ctx.update( dto ).then( dto => {
      ctx.fulfill( null );
    } );
  }
}

function dataRemove( ctx ) {
  const primaryKey = ctx.getValue( 'orderItemKey' );
  ctx.remove( primaryKey ).then( dto => {
    ctx.fulfill( null );
  } );
}

//endregion

const extensions = new Extensions( 'dal', __filename );
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

const BlanketOrderItem = bo.EditableChildObject( 'BlanketOrderItem', properties, rules, extensions );

module.exports = BlanketOrderItem;
