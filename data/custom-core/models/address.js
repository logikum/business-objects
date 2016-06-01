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

const addressKey = new Property( 'addressKey', dt.Integer, F.key | F.readOnly );
const orderKey = new Property( 'orderKey', dt.Integer, F.parentKey | F.readOnly );
const country = new Property( 'country', dt.Text );
const state = new Property( 'state', dt.Text );
const city = new Property( 'city', dt.Text );
const line1 = new Property( 'line1', dt.Text );
const line2 = new Property( 'line2', dt.Text );
const postalCode = new Property( 'postalCode', dt.Text );

const properties = new Properties(
  addressKey,
  orderKey,
  country,
  state,
  city,
  line1,
  line2,
  postalCode
);

const rules = new Rules(
  cr.required( country ),
  cr.required( city ),
  cr.required( line1 ),
  cr.required( postalCode )
);

//region Transfer object methods

function toDto( ctx ) {
  return {
    addressKey: ctx.getValue( 'addressKey' ),
    orderKey: ctx.getValue( 'orderKey' ),
    country: ctx.getValue( 'country' ),
    state: ctx.getValue( 'state' ),
    city: ctx.getValue( 'city' ),
    line1: ctx.getValue( 'line1' ),
    line2: ctx.getValue( 'line2' ),
    postalCode: ctx.getValue( 'postalCode' )
  };
}

function fromDto( ctx, dto ) {
  ctx.setValue( 'addressKey', dto.addressKey );
  ctx.setValue( 'orderKey', dto.orderKey );
  ctx.setValue( 'country', dto.country );
  ctx.setValue( 'state', dto.state );
  ctx.setValue( 'city', dto.city );
  ctx.setValue( 'line1', dto.line1 );
  ctx.setValue( 'line2', dto.line2 );
  ctx.setValue( 'postalCode', dto.postalCode );
}

function toCto( ctx ) {
  return {
    addressKey: this.addressKey,
    orderKey: this.orderKey,
    country: this.country,
    state: this.state,
    city: this.city,
    line1: this.line1,
    line2: this.line2,
    postalCode: this.postalCode
  };
}

function fromCto( ctx, dto ) {
//this.addressKey = dto.addressKey;
//this.orderKey =   dto.orderKey;
  this.country = dto.country;
  this.state = dto.state;
  this.city = dto.city;
  this.line1 = dto.line1;
  this.line2 = dto.line2;
  this.postalCode = dto.postalCode;
}

//endregion

//region Data portal methods

function dataCreate( ctx ) {
  ctx.create().then( dto => {
    ctx.setValue( 'country', dto.country );
    ctx.setValue( 'state', dto.state );
    ctx.setValue( 'city', dto.city );
    ctx.setValue( 'line1', dto.line1 );
    ctx.setValue( 'line2', dto.line2 );
    ctx.setValue( 'postalCode', dto.postalCode );
    ctx.fulfill( null );
  } );
}

function dataFetch( ctx, dto, method ) {
  ctx.setValue( 'addressKey', dto.addressKey );
  ctx.setValue( 'orderKey', dto.orderKey );
  ctx.setValue( 'country', dto.country );
  ctx.setValue( 'state', dto.state );
  ctx.setValue( 'city', dto.city );
  ctx.setValue( 'line1', dto.line1 );
  ctx.setValue( 'line2', dto.line2 );
  ctx.setValue( 'postalCode', dto.postalCode );
  ctx.fulfill( dto );
}

function dataInsert( ctx ) {
  const dto = {
    orderKey: ctx.getValue( 'orderKey' ),
    country: ctx.getValue( 'country' ),
    state: ctx.getValue( 'state' ),
    city: ctx.getValue( 'city' ),
    line1: ctx.getValue( 'line1' ),
    line2: ctx.getValue( 'line2' ),
    postalCode: ctx.getValue( 'postalCode' )
  };
  ctx.insert( dto ).then( dto => {
    ctx.setValue( 'addressKey', dto.addressKey );
    ctx.fulfill( null );
  } );
}

function dataUpdate( ctx ) {
  if (ctx.isSelfDirty) {
    const dto = {
      addressKey: ctx.getValue( 'addressKey' ),
      country: ctx.getValue( 'country' ),
      state: ctx.getValue( 'state' ),
      city: ctx.getValue( 'city' ),
      line1: ctx.getValue( 'line1' ),
      line2: ctx.getValue( 'line2' ),
      postalCode: ctx.getValue( 'postalCode' )
    };
    ctx.update( dto ).then( dto => {
      ctx.fulfill( null );
    } );
  }
}

function dataRemove( ctx ) {
  const primaryKey = ctx.getValue( 'addressKey' );
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

const Address = new bo.EditableChildObject( 'Address', properties, rules, extensions );

module.exports = Address;
