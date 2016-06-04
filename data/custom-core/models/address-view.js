'use strict';

const bo = require( '../../../source/index.js' );

const Properties = bo.common.PropertyManager;
const Rules = bo.rules.RuleManager;
const Extensions = bo.common.ExtensionManager;
const Property = bo.common.PropertyInfo;
const F = bo.common.PropertyFlag;
const dt = bo.dataTypes;
const cr = bo.commonRules;

const addressKey = new Property( 'addressKey', dt.Integer, F.key );
const orderKey = new Property( 'orderKey', dt.Integer, F.parentKey );
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
);

//region Transfer object methods

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

//endregion

//region Data portal methods

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

//endregion

const extensions = new Extensions( 'dal', __filename );
extensions.fromDto = fromDto;
extensions.toCto = toCto;
extensions.dataFetch = dataFetch;

const AddressView = new bo.ReadOnlyChildObject(
  'AddressView', properties, rules, extensions
);

module.exports = AddressView;
