'use strict';

const bo = require( '../../../source/index.js' );

const Properties = bo.shared.PropertyManager;
const Rules = bo.rules.RuleManager;
const Extensions = bo.shared.ExtensionManager;
const Property = bo.shared.PropertyInfo;
const F = bo.shared.PropertyFlag;
const dt = bo.dataTypes;
const cr = bo.commonRules;

const BlanketOrderSchedulesView = require( './blanket-order-schedules-view.js' );

const orderItemKey = new Property( 'orderItemKey', dt.Integer, F.key );
const orderKey = new Property( 'orderKey', dt.Integer, F.parentKey );
const productName = new Property( 'productName', dt.Text );
const obsolete = new Property( 'obsolete', dt.Boolean );
const expiry = new Property( 'expiry', dt.DateTime );
const quantity = new Property( 'quantity', dt.Integer );
const unitPrice = new Property( 'unitPrice', dt.Decimal );
const schedules = new Property( 'schedules', BlanketOrderSchedulesView );

const properties = new Properties(
  orderItemKey,
  orderKey,
  productName,
  obsolete,
  expiry,
  quantity,
  unitPrice,
  schedules
);

const rules = new Rules(
);

//region Transfer object methods

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

//endregion

//region Data portal methods

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

//endregion

const extensions = new Extensions( 'dal', __filename );
extensions.fromDto = fromDto;
extensions.toCto = toCto;
extensions.dataFetch = dataFetch;

const BlanketOrderItemView = new bo.ReadOnlyChildObject(
  'BlanketOrderItemView', properties, rules, extensions
);

module.exports = BlanketOrderItemView;
