'use strict';

const bo = require( '../../../source/index.js' );

const Properties = bo.shared.PropertyManager;
const Rules = bo.rules.RuleManager;
const Extensions = bo.shared.ExtensionManager;
const Property = bo.shared.PropertyInfo;
const F = bo.shared.PropertyFlag;
const dt = bo.dataTypes;
const cr = bo.commonRules;

function getOrderCode( ctx ) {
  return ctx.getValue( 'orderKey' ).toString( 2 );
}

const orderKey = new Property( 'orderKey', dt.Integer, F.key | F.onDtoOnly );
const orderCode = new Property( 'orderCode', dt.Text, F.onCtoOnly, getOrderCode );
const vendorName = new Property( 'vendorName', dt.Text );
const contractDate = new Property( 'contractDate', dt.DateTime );
const totalPrice = new Property( 'totalPrice', dt.Decimal );
const schedules = new Property( 'schedules', dt.Integer );
const enabled = new Property( 'enabled', dt.Boolean );
const createdDate = new Property( 'createdDate', dt.DateTime );
const modifiedDate = new Property( 'modifiedDate', dt.DateTime );

const properties = new Properties(
  orderKey,
  orderCode,
  vendorName,
  contractDate,
  totalPrice,
  schedules,
  enabled,
  createdDate,
  modifiedDate
);

const rules = new Rules(
);

//region Transfer object methods

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
    orderCode: this.orderCode,
    vendorName: this.vendorName,
    contractDate: this.contractDate,
    totalPrice: this.totalPrice,
    schedules: this.schedules,
    enabled: this.enabled,
    createdDate: this.createdDate,
    modifiedDate: this.modifiedDate
  };
}

//endregion

//region Data portal methods

function dataFetch( ctx, dto, method ) {
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

//endregion

const extensions = new Extensions( 'dal', __filename );
extensions.fromDto = fromDto;
extensions.toCto = toCto;
extensions.dataFetch = dataFetch;

const BlanketOrderListItem = bo.ReadOnlyChildObject( 'BlanketOrderListItem', properties, rules, extensions );

module.exports = BlanketOrderListItem;
