'use strict';

const bo = require( '../../source/index.js' );

const Properties = bo.shared.PropertyManager;
const Rules = bo.rules.RuleManager;
const Extensions = bo.shared.ExtensionManager;
const Property = bo.shared.PropertyInfo;
const F = bo.shared.PropertyFlag;
const dt = bo.dataTypes;
const cr = bo.commonRules;

const orderKey = new Property( 'orderKey', dt.Integer, F.key );
const vendorName = new Property( 'vendorName', dt.Text );
const contractDate = new Property( 'contractDate', dt.DateTime );
const totalPrice = new Property( 'totalPrice', dt.Decimal );
const schedules = new Property( 'schedules', dt.Integer );
const enabled = new Property( 'enabled', dt.Boolean );
const createdDate = new Property( 'createdDate', dt.DateTime );
const modifiedDate = new Property( 'modifiedDate', dt.DateTime );

const properties = new Properties(
  orderKey,
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

const extensions = new Extensions( 'dao', __filename );

const BlanketOrderListItem = new bo.ReadOnlyChildObject(
  'BlanketOrderListItem', properties, rules, extensions
);

module.exports = BlanketOrderListItem;
