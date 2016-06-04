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

const AddressView = require( './address-view.js' );
const BlanketOrderItemsView = require( './blanket-order-items-view.js' );

const orderKey = new Property( 'orderKey', dt.Integer, F.key );
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

//endregion

//region Data portal methods

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

//endregion

const extensions = new Extensions( 'dal', __filename );
extensions.daoBuilder = daoBuilder;
extensions.fromDto = fromDto;
extensions.toCto = toCto;
extensions.dataFetch = dataFetch;

const BlanketOrderView = new bo.ReadOnlyRootObject( 'BlanketOrderView', properties, rules, extensions );

const BlanketOrderViewFactory = {
  get: function ( key, eventHandlers ) {
    return BlanketOrderView.fetch( key, null, eventHandlers );
  },
  getByName: function ( name, eventHandlers ) {
    return BlanketOrderView.fetch( name, 'fetchByName', eventHandlers );
  }
};

module.exports = BlanketOrderViewFactory;
