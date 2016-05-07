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

const orderScheduleKey = new Property( 'orderScheduleKey', dt.Integer, F.key | F.readOnly );
const orderItemKey = new Property( 'orderItemKey', dt.Integer, F.parentKey | F.readOnly );
const quantity = new Property( 'quantity', dt.Integer );
const totalMass = new Property( 'totalMass', dt.Decimal );
const required = new Property( 'required', dt.Boolean );
const shipTo = new Property( 'shipTo', dt.Text );
const shipDate = new Property( 'shipDate', dt.DateTime );

const properties = new Properties(
  orderScheduleKey,
  orderItemKey,
  quantity,
  totalMass,
  required,
  shipTo,
  shipDate
);

const rules = new Rules(
  cr.required( quantity ),
  cr.required( totalMass ),
  cr.required( required ),
  cr.required( shipTo ),
  cr.required( shipDate )
);

//region Transfer object methods

function toDto( ctx ) {
  return {
    orderScheduleKey: ctx.getValue( 'orderScheduleKey' ),
    orderItemKey: ctx.getValue( 'orderItemKey' ),
    quantity: ctx.getValue( 'quantity' ),
    totalMass: ctx.getValue( 'totalMass' ),
    required: ctx.getValue( 'required' ),
    shipTo: ctx.getValue( 'shipTo' ),
    shipDate: ctx.getValue( 'shipDate' )
  };
}

function fromDto( ctx, dto ) {
  ctx.setValue( 'orderScheduleKey', dto.orderScheduleKey );
  ctx.setValue( 'orderItemKey', dto.orderItemKey );
  ctx.setValue( 'quantity', dto.quantity );
  ctx.setValue( 'totalMass', dto.totalMass );
  ctx.setValue( 'required', dto.required );
  ctx.setValue( 'shipTo', dto.shipTo );
  ctx.setValue( 'shipDate', dto.shipDate );
}

function toCto( ctx ) {
  return {
    orderScheduleKey: this.orderScheduleKey,
    orderItemKey: this.orderItemKey,
    quantity: this.quantity,
    totalMass: this.totalMass,
    required: this.required,
    shipTo: this.shipTo,
    shipDate: this.shipDate
  };
}

function fromCto( ctx, dto ) {
//this.orderScheduleKey = dto.orderScheduleKey;
//this.orderItemKey =     dto.orderItemKey;
  this.quantity = dto.quantity;
  this.totalMass = dto.totalMass;
  this.required = dto.required;
  this.shipTo = dto.shipTo;
  this.shipDate = dto.shipDate;
}

//endregion

//region Data portal methods

function dataCreate( ctx ) {
  ctx.create().then( dto => {
    ctx.setValue( 'quantity', dto.quantity );
    ctx.setValue( 'totalMass', dto.totalMass );
    ctx.setValue( 'required', dto.required );
    ctx.setValue( 'shipTo', dto.shipTo );
    ctx.setValue( 'shipDate', dto.shipDate );
    ctx.fulfill( null );
  } );
}

function dataFetch( ctx, dto, method ) {
  ctx.setValue( 'orderScheduleKey', dto.orderScheduleKey );
  ctx.setValue( 'orderItemKey', dto.orderItemKey );
  ctx.setValue( 'quantity', dto.quantity );
  ctx.setValue( 'totalMass', dto.totalMass );
  ctx.setValue( 'required', dto.required );
  ctx.setValue( 'shipTo', dto.shipTo );
  ctx.setValue( 'shipDate', dto.shipDate );
  ctx.fulfill( dto );
}

function dataInsert( ctx ) {
  const dto = {
    orderItemKey: ctx.getValue( 'orderItemKey' ),
    quantity: ctx.getValue( 'quantity' ),
    totalMass: ctx.getValue( 'totalMass' ),
    required: ctx.getValue( 'required' ),
    shipTo: ctx.getValue( 'shipTo' ),
    shipDate: ctx.getValue( 'shipDate' )
  };
  ctx.insert( dto ).then( dto => {
    ctx.setValue( 'orderScheduleKey', dto.orderScheduleKey );
    ctx.fulfill( null );
  } );
}

function dataUpdate( ctx ) {
  if (ctx.isSelfDirty) {
    const dto = {
      orderScheduleKey: ctx.getValue( 'orderScheduleKey' ),
      quantity: ctx.getValue( 'quantity' ),
      totalMass: ctx.getValue( 'totalMass' ),
      required: ctx.getValue( 'required' ),
      shipTo: ctx.getValue( 'shipTo' ),
      shipDate: ctx.getValue( 'shipDate' )
    };
    ctx.update( dto ).then( dto => {
      ctx.fulfill( null );
    } );
  }
}

function dataRemove( ctx ) {
  const primaryKey = ctx.getValue( 'orderScheduleKey' );
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

const BlanketOrderSchedule = bo.EditableChildObject( 'BlanketOrderSchedule', properties, rules, extensions );

module.exports = BlanketOrderSchedule;
