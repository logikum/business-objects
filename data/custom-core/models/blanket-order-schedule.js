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

var orderScheduleKey = new Property( 'orderScheduleKey', dt.Integer, F.key | F.readOnly );
var orderItemKey = new Property( 'orderItemKey', dt.Integer, F.parentKey | F.readOnly );
var quantity = new Property( 'quantity', dt.Integer );
var totalMass = new Property( 'totalMass', dt.Decimal );
var required = new Property( 'required', dt.Boolean );
var shipTo = new Property( 'shipTo', dt.Text );
var shipDate = new Property( 'shipDate', dt.DateTime );

var properties = new Properties(
    orderScheduleKey,
    orderItemKey,
    quantity,
    totalMass,
    required,
    shipTo,
    shipDate
);

var rules = new Rules(
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
    orderItemKey:     ctx.getValue( 'orderItemKey' ),
    quantity:         ctx.getValue( 'quantity' ),
    totalMass:        ctx.getValue( 'totalMass' ),
    required:         ctx.getValue( 'required' ),
    shipTo:           ctx.getValue( 'shipTo' ),
    shipDate:         ctx.getValue( 'shipDate' )
  };
}

function fromDto( ctx, dto ) {
  ctx.setValue( 'orderScheduleKey',  dto.orderScheduleKey );
  ctx.setValue( 'orderItemKey',      dto.orderItemKey );
  ctx.setValue( 'quantity',          dto.quantity );
  ctx.setValue( 'totalMass',         dto.totalMass );
  ctx.setValue( 'required',          dto.required );
  ctx.setValue( 'shipTo',            dto.shipTo );
  ctx.setValue( 'shipDate',          dto.shipDate );
}

function toCto( ctx ) {
  return {
    orderScheduleKey: this.orderScheduleKey,
    orderItemKey:     this.orderItemKey,
    quantity:         this.quantity,
    totalMass:        this.totalMass,
    required:         this.required,
    shipTo:           this.shipTo,
    shipDate:         this.shipDate
   };
}

function fromCto( ctx, dto ) {
//this.orderScheduleKey = dto.orderScheduleKey;
//this.orderItemKey =     dto.orderItemKey;
  this.quantity =         dto.quantity;
  this.totalMass =        dto.totalMass;
  this.required =         dto.required;
  this.shipTo =           dto.shipTo;
  this.shipDate =         dto.shipDate;
}

//endregion

//region Data portal methods

function dataCreate( ctx ) {
  ctx.create().then( dto => {
    ctx.setValue( 'quantity',  dto.quantity );
    ctx.setValue( 'totalMass', dto.totalMass );
    ctx.setValue( 'required',  dto.required );
    ctx.setValue( 'shipTo',    dto.shipTo );
    ctx.setValue( 'shipDate',  dto.shipDate );
    ctx.fulfill( null );
  });
}

function dataFetch( ctx, dto, method ) {
  ctx.setValue( 'orderScheduleKey', dto.orderScheduleKey );
  ctx.setValue( 'orderItemKey',     dto.orderItemKey );
  ctx.setValue( 'quantity',         dto.quantity );
  ctx.setValue( 'totalMass',        dto.totalMass );
  ctx.setValue( 'required',         dto.required );
  ctx.setValue( 'shipTo',           dto.shipTo );
  ctx.setValue( 'shipDate',         dto.shipDate );
  ctx.fulfill( dto );
}

function dataInsert( ctx ) {
  var dto = {
    orderItemKey: ctx.getValue( 'orderItemKey' ),
    quantity:     ctx.getValue( 'quantity' ),
    totalMass:    ctx.getValue( 'totalMass' ),
    required:     ctx.getValue( 'required' ),
    shipTo:       ctx.getValue( 'shipTo' ),
    shipDate:     ctx.getValue( 'shipDate' )
  };
  ctx.insert( dto ).then( dto => {
    ctx.setValue( 'orderScheduleKey', dto.orderScheduleKey );
    ctx.fulfill( null );
  });
}

function dataUpdate( ctx ) {
  if (ctx.isSelfDirty) {
    var dto = {
      orderScheduleKey: ctx.getValue( 'orderScheduleKey' ),
      quantity:         ctx.getValue( 'quantity' ),
      totalMass:        ctx.getValue( 'totalMass' ),
      required:         ctx.getValue( 'required' ),
      shipTo:           ctx.getValue( 'shipTo' ),
      shipDate:         ctx.getValue( 'shipDate' )
    };
    ctx.update( dto ).then( dto => {
      ctx.fulfill( null );
    });
  }
}

function dataRemove( ctx ) {
  var primaryKey = ctx.getValue( 'orderScheduleKey' );
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

var BlanketOrderSchedule = bo.EditableChildObject( 'BlanketOrderSchedule', properties, rules, extensions );

module.exports = BlanketOrderSchedule;
