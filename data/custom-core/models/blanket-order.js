'use strict';

const bo = require( '../../../source/index.js' );
const daoBuilder = require( '../dao-builder.js' );

const Properties = bo.common.PropertyManager;
const Rules = bo.rules.RuleManager;
const Action = bo.rules.AuthorizationAction;
const Extensions = bo.common.ExtensionManager;
const Property = bo.common.PropertyInfo;
const F = bo.common.PropertyFlag;
const dt = bo.dataTypes;
const cr = bo.commonRules;

const Address = require( './address.js' );
const BlanketOrderItems = require( './blanket-order-items.js' );

const orderKey = new Property( 'orderKey', dt.Integer, F.key | F.readOnly );
const vendorName = new Property( 'vendorName', dt.Text );
const contractDate = new Property( 'contractDate', dt.DateTime );
const totalPrice = new Property( 'totalPrice', dt.Decimal );
const schedules = new Property( 'schedules', dt.Integer );
const enabled = new Property( 'enabled', dt.Boolean );
const address = new Property( 'address', Address );
const items = new Property( 'items', BlanketOrderItems );
const createdDate = new Property( 'createdDate', dt.DateTime, F.readOnly );
const modifiedDate = new Property( 'modifiedDate', dt.DateTime, F.readOnly );

const properties = new Properties(
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

const rules = new Rules(
  cr.required( vendorName ),
  cr.required( contractDate ),
  cr.required( totalPrice ),
  cr.required( schedules ),
  cr.required( enabled ),
  cr.isInRole( Action.fetchObject, null, 'developers', 'You are not authorized to retrieve blanket order.' ),
  cr.isInRole( Action.createObject, null, 'developers', 'You are not authorized to create blanket order.' ),
  cr.isInRole( Action.updateObject, null, 'developers', 'You are not authorized to modify blanket order.' ),
  cr.isInRole( Action.removeObject, null, 'developers', 'You are not authorized to delete blanket order.' )
);

//region Transfer object methods

function toDto( ctx ) {
  return {
    orderKey: ctx.getValue( 'orderKey' ),
    vendorName: ctx.getValue( 'vendorName' ),
    contractDate: ctx.getValue( 'contractDate' ),
    totalPrice: ctx.getValue( 'totalPrice' ),
    schedules: ctx.getValue( 'schedules' ),
    enabled: ctx.getValue( 'enabled' ),
    createdDate: ctx.getValue( 'createdDate' ),
    modifiedDate: ctx.getValue( 'modifiedDate' )
  };
}

function fromDto( ctx, dto ) {
  ctx.setValue( 'orderKey', dto.orderKey );
  ctx.setValue( 'vendorName', dto.vendorName );
  ctx.setValue( 'contractDate', dto.contractDate );
  ctx.setValue( 'totalPrice', dto.totalPrice );
  ctx.setValue( 'schedules', dto.schedules );
  ctx.setValue( 'enabled', dto.enabled );
  ctx.setValue( 'createdDate', dto.createdDate );
  ctx.setValue( 'modifiedDate', dto.modifiedDate );
}

function toCto( ctx ) {
  return {
    orderKey: this.orderKey,
    vendorName: this.vendorName,
    contractDate: this.contractDate,
    totalPrice: this.totalPrice,
    schedules: this.schedules,
    enabled: this.enabled,
    createdDate: this.createdDate,
    modifiedDate: this.modifiedDate
  };
}

function fromCto( ctx, dto ) {
//this.orderKey =     dto.orderKey;
  this.vendorName = dto.vendorName;
  this.contractDate = dto.contractDate;
  this.totalPrice = dto.totalPrice;
  this.schedules = dto.schedules;
  this.enabled = dto.enabled;
//this.createdDate =  dto.createdDate;
//this.modifiedDate = dto.modifiedDate;
}

//endregion

//region Data portal methods

function dataCreate( ctx ) {
  ctx.create().then( dto => {
    ctx.setValue( 'vendorName', dto.vendorName );
    ctx.setValue( 'contractDate', dto.contractDate );
    ctx.setValue( 'totalPrice', dto.totalPrice );
    ctx.setValue( 'schedules', dto.schedules );
    ctx.setValue( 'enabled', dto.enabled );
    ctx.fulfill( null );
  } );
}

function dataFetch( ctx, filter, method ) {
  function finish( dto ) {
    ctx.setValue( 'orderKey', dto.orderKey );
    ctx.setValue( 'vendorName', dto.vendorName );
    ctx.setValue( 'contractDate', dto.contractDate );
    ctx.setValue( 'totalPrice', dto.totalPrice );
    ctx.setValue( 'schedules', dto.schedules );
    ctx.setValue( 'enabled', dto.enabled );
    ctx.setValue( 'createdDate', dto.createdDate );
    ctx.setValue( 'modifiedDate', dto.modifiedDate );
    ctx.fulfill( dto );
  }

  if (method === 'fetchByName') {
    // filter: vendorName
    ctx.call( 'fetchByName', filter ).then( finish );
  } else {
    // filter: primaryKey
    ctx.fetch( filter ).then( finish );
  }
  // or:
  // ctx.call( method, filter ).then( finish );
}

function dataInsert( ctx ) {
  const dto = {
    vendorName: ctx.getValue( 'vendorName' ),
    contractDate: ctx.getValue( 'contractDate' ),
    totalPrice: ctx.getValue( 'totalPrice' ),
    schedules: ctx.getValue( 'schedules' ),
    enabled: ctx.getValue( 'enabled' )
  };
  ctx.insert( dto ).then( dto => {
    ctx.setValue( 'orderKey', dto.orderKey );
    ctx.setValue( 'createdDate', dto.createdDate );
    ctx.fulfill( null );
  } );
}

function dataUpdate( ctx ) {
  if (ctx.isSelfDirty) {
    const dto = {
      orderKey: ctx.getValue( 'orderKey' ),
      vendorName: ctx.getValue( 'vendorName' ),
      contractDate: ctx.getValue( 'contractDate' ),
      totalPrice: ctx.getValue( 'totalPrice' ),
      schedules: ctx.getValue( 'schedules' ),
      enabled: ctx.getValue( 'enabled' )
    };
    ctx.update( dto ).then( dto => {
      ctx.setValue( 'modifiedDate', dto.modifiedDate );
      ctx.fulfill( null );
    } );
  }
}

function dataRemove( ctx ) {
  const primaryKey = ctx.getValue( 'orderKey' );
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

const BlanketOrder = new bo.EditableRootObject( 'BlanketOrder', properties, rules, extensions );

const BlanketOrderFactory = {
  create: function ( eventHandlers ) {
    return BlanketOrder.create( eventHandlers );
  },
  get: function ( key, eventHandlers ) {
    return BlanketOrder.fetch( key, null, eventHandlers );
  },
  getByName: function ( name, eventHandlers ) {
    return BlanketOrder.fetch( name, 'fetchByName', eventHandlers );
  }
};

module.exports = BlanketOrderFactory;
