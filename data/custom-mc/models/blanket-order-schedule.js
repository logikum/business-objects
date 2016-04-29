'use strict';

var bo = require('../../../source/index.js');
var daoBuilder = require('../dao-builder.js');
var Model = bo.ModelComposer;
var F = bo.shared.PropertyFlag;

//region Transfer object methods

function toDto (ctx) {
    return {
        orderScheduleKey: ctx.getValue('orderScheduleKey'),
        orderItemKey:     ctx.getValue('orderItemKey'),
        quantity:         ctx.getValue('quantity'),
        totalMass:        ctx.getValue('totalMass'),
        required:         ctx.getValue('required'),
        shipTo:           ctx.getValue('shipTo'),
        shipDate:         ctx.getValue('shipDate')
    };
}

function fromDto (ctx, dto) {
    ctx.setValue('orderScheduleKey',  dto.orderScheduleKey);
    ctx.setValue('orderItemKey',      dto.orderItemKey);
    ctx.setValue('quantity',          dto.quantity);
    ctx.setValue('totalMass',         dto.totalMass);
    ctx.setValue('required',          dto.required);
    ctx.setValue('shipTo',            dto.shipTo);
    ctx.setValue('shipDate',          dto.shipDate);
}

function toCto (ctx) {
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

function fromCto (ctx, dto) {
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
  ctx.dao.create( ctx.connection ).then( dto => {
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
  ctx.dao.insert( ctx.connection, dto ).then( dto => {
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
    ctx.dao.update( ctx.connection, dto ).then( dto => {
      ctx.fulfill( null );
    });
  }
}

function dataRemove( ctx ) {
  var primaryKey = ctx.getValue( 'orderScheduleKey' );
  ctx.dao.remove( ctx.connection, primaryKey ).then( dto => {
    ctx.fulfill( null );
  });
}

//endregion

var BlanketOrderSchedule = Model('BlanketOrderSchedule')
    .editableChildObject('dal', __filename)
    // --- Properties
    .integer('orderScheduleKey', F.key | F.readOnly)
    .integer('orderItemKey', F.parentKey | F.readOnly)
    .integer('quantity')
        .required()
    .decimal('totalMass')
        .required()
    .boolean('required')
        .required()
    .text('shipTo')
        .required()
    .dateTime('shipDate')
        .required()
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

module.exports = BlanketOrderSchedule;
