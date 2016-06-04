'use strict';

const bo = require( '../../source/index.js' );

const Properties = bo.common.PropertyManager;
const Rules = bo.rules.RuleManager;
const Extensions = bo.common.ExtensionManager;
const Property = bo.common.PropertyInfo;
const F = bo.common.PropertyFlag;
const dt = bo.dataTypes;
const cr = bo.commonRules;

const BlanketOrderSchedules = require( './blanket-order-schedules.js' );

const orderItemKey = new Property( 'orderItemKey', dt.Integer, F.key | F.readOnly );
const orderKey = new Property( 'orderKey', dt.Integer, F.parentKey | F.readOnly );
const productName = new Property( 'productName', dt.Text );
const obsolete = new Property( 'obsolete', dt.Boolean );
const expiry = new Property( 'expiry', dt.DateTime );
const quantity = new Property( 'quantity', dt.Integer );
const unitPrice = new Property( 'unitPrice', dt.Decimal );
const schedules = new Property( 'schedules', BlanketOrderSchedules );

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
  cr.required( productName ),
  cr.required( obsolete ),
  cr.required( expiry ),
  cr.required( quantity ),
  cr.required( unitPrice )
);

const extensions = new Extensions( 'dao', __filename );

const BlanketOrderItem = new bo.EditableChildObject( 'BlanketOrderItem', properties, rules, extensions );

module.exports = BlanketOrderItem;
