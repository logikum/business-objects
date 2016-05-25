'use strict';

const bo = require( '../../../source/index.js' );
const daoBuilder = require( '../dao-builder.js' );
const Model = bo.ModelComposer;
const F = bo.shared.PropertyFlag;

const BlanketOrderSchedules = require( './blanket-order-schedules.js' );

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

const BlanketOrderItem = new Model( 'BlanketOrderItem' )
  .editableChildObject( 'dal', __filename )
  // --- Properties
  .integer( 'orderItemKey', F.key | F.readOnly )
  .integer( 'orderKey', F.parentKey | F.readOnly )
  .text( 'productName' )
    .required()
  .boolean( 'obsolete' )
    .required()
  .dateTime( 'expiry' )
    .required()
  .integer( 'quantity' )
    .required()
  .decimal( 'unitPrice' )
    .required()
  .property( 'schedules', BlanketOrderSchedules )
  // --- Customization
  .daoBuilder( daoBuilder )
  .toDto( toDto )
  .fromDto( fromDto )
  .toCto( toCto )
  .fromCto( fromCto )
  .dataCreate( dataCreate )
  .dataFetch( dataFetch )
  .dataInsert( dataInsert )
  .dataUpdate( dataUpdate )
  .dataRemove( dataRemove )
  // --- Build model class
  .compose();

module.exports = BlanketOrderItem;
