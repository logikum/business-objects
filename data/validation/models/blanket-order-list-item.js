'use strict';

const bo = require( '../../../source/index.js' );

const Properties = bo.common.PropertyManager;
const Rules = bo.rules.RuleManager;
const Action = bo.rules.AuthorizationAction;
const Extensions = bo.common.ExtensionManager;
const Property = bo.common.PropertyInfo;
const F = bo.common.PropertyFlag;
const dt = bo.dataTypes;
const cr = bo.commonRules;

const AddressView = require( './address-view.js' );
const BlanketOrderItemsView = require( './blanket-order-items-view.js' );

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
const address = new Property( 'address', AddressView );
const items = new Property( 'items', BlanketOrderItemsView );
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
  cr.isInRole( Action.fetchObject, null, 'designers', 'You are not authorized to retrieve blanket order.' ),
  cr.isInAnyRole( Action.readProperty, totalPrice, [ 'salesmen', 'administrators' ],
    'You are not authorized to view the totalPrice of the blanket order.' )
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

const BlanketOrderListItem = new bo.ReadOnlyChildObject(
  'BlanketOrderListItem', properties, rules, extensions
);

module.exports = BlanketOrderListItem;
