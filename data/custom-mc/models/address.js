'use strict';

var bo = require('../../../source/index.js');
var daoBuilder = require('../dao-builder.js');
var Model = bo.ModelComposer;
var F = bo.shared.PropertyFlag;

//region Transfer object methods

function toDto (ctx) {
    return {
        addressKey: ctx.getValue('addressKey'),
        orderKey:   ctx.getValue('orderKey'),
        country:    ctx.getValue('country'),
        state:      ctx.getValue('state'),
        city:       ctx.getValue('city'),
        line1:      ctx.getValue('line1'),
        line2:      ctx.getValue('line2'),
        postalCode: ctx.getValue('postalCode')
    };
}

function fromDto (ctx, dto) {
    ctx.setValue('addressKey',  dto.addressKey);
    ctx.setValue('orderKey',    dto.orderKey);
    ctx.setValue('country',     dto.country);
    ctx.setValue('state',       dto.state);
    ctx.setValue('city',        dto.city);
    ctx.setValue('line1',       dto.line1);
    ctx.setValue('line2',       dto.line2);
    ctx.setValue('postalCode',  dto.postalCode);
}

function toCto (ctx) {
    return {
        addressKey:     this.addressKey,
        orderKey:   this.orderKey,
        country: this.country,
        state:   this.state,
        city:    this.city,
        line1:      this.line1,
        line2:  this.line2,
        postalCode: this.postalCode
    };
}

function fromCto (ctx, dto) {
    //this.addressKey = dto.addressKey;
    //this.orderKey =   dto.orderKey;
    this.country =    dto.country;
    this.state =      dto.state;
    this.city =       dto.city;
    this.line1 =      dto.line1;
    this.line2 =      dto.line2;
    this.postalCode = dto.postalCode;
}

//endregion

//region Data portal methods

function dataCreate( ctx ) {
  ctx.dao.create( ctx.connection ).then( dto => {
    ctx.setValue( 'country',    dto.country );
    ctx.setValue( 'state',      dto.state );
    ctx.setValue( 'city',       dto.city );
    ctx.setValue( 'line1',      dto.line1 );
    ctx.setValue( 'line2',      dto.line2 );
    ctx.setValue( 'postalCode', dto.postalCode );
    ctx.fulfill( null );
  });
}

function dataFetch( ctx, dto, method ) {
  ctx.setValue( 'addressKey', dto.addressKey );
  ctx.setValue( 'orderKey',   dto.orderKey );
  ctx.setValue( 'country',    dto.country );
  ctx.setValue( 'state',      dto.state );
  ctx.setValue( 'city',       dto.city );
  ctx.setValue( 'line1',      dto.line1 );
  ctx.setValue( 'line2',      dto.line2 );
  ctx.setValue( 'postalCode', dto.postalCode );
  ctx.fulfill( dto );
}

function dataInsert( ctx ) {
  var dto = {
    orderKey:   ctx.getValue( 'orderKey' ),
    country:    ctx.getValue( 'country' ),
    state:      ctx.getValue( 'state' ),
    city:       ctx.getValue( 'city' ),
    line1:      ctx.getValue( 'line1' ),
    line2:      ctx.getValue( 'line2' ),
    postalCode: ctx.getValue( 'postalCode' )
  };
  ctx.dao.insert( ctx.connection, dto ).then( dto => {
    ctx.setValue( 'addressKey', dto.addressKey );
    ctx.fulfill( null );
  });
}

function dataUpdate( ctx ) {
  if (ctx.isSelfDirty) {
    var dto = {
      addressKey: ctx.getValue( 'addressKey' ),
      country:    ctx.getValue( 'country' ),
      state:      ctx.getValue( 'state' ),
      city:       ctx.getValue( 'city' ),
      line1:      ctx.getValue( 'line1' ),
      line2:      ctx.getValue( 'line2' ),
      postalCode: ctx.getValue( 'postalCode' )
    };
    ctx.dao.update( ctx.connection, dto ).then( dto => {
      ctx.fulfill( null );
    });
  }
}

function dataRemove( ctx ) {
  var primaryKey = ctx.getValue( 'addressKey' );
  ctx.dao.remove( ctx.connection, primaryKey ).then( dto => {
    ctx.fulfill( null );
  });
}

//endregion

var Address = Model('Address')
    .editableChildObject('dal', __filename)
    // --- Properties
    .integer('addressKey', F.key | F.readOnly)
    .integer('orderKey', F.parentKey | F.readOnly)
    .text('country')
        .required()
    .text('state')
    .text('city')
        .required()
    .text('line1')
        .required()
    .text('line2')
    .text('postalCode')
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

module.exports = Address;
