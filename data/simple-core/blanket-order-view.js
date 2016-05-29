'use strict';

const bo = require( '../../source/index.js' );

const Properties = bo.shared.PropertyManager;
const Rules = bo.rules.RuleManager;
const Action = bo.rules.AuthorizationAction;
const Extensions = bo.shared.ExtensionManager;
const Property = bo.shared.PropertyInfo;
const F = bo.shared.PropertyFlag;
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

const extensions = new Extensions( 'dao', __filename );

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
