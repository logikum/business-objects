'use strict';

const bo = require( '../../source/index.js' );

const Properties = bo.common.PropertyManager;
const Rules = bo.rules.RuleManager;
const Extensions = bo.common.ExtensionManager;
const Property = bo.common.PropertyInfo;
const F = bo.common.PropertyFlag;
const dt = bo.dataTypes;
const cr = bo.commonRules;

const orderScheduleKey = new Property( 'orderScheduleKey', dt.Integer, F.key );
const orderItemKey = new Property( 'orderItemKey', dt.Integer, F.parentKey );
const quantity = new Property( 'quantity', dt.Integer );
const totalMass = new Property( 'totalMass', dt.Decimal );
const required = new Property( 'required', dt.Boolean );
const shipTo = new Property( 'shipTo', dt.Text );
const shipDate = new Property( 'shipDate', dt.DateTime );

const properties = new Properties(
  orderScheduleKey,
  orderItemKey,
  quantity,
  totalMass,
  required,
  shipTo,
  shipDate
);

const rules = new Rules(
);

const extensions = new Extensions( 'dao', __filename );

const BlanketOrderScheduleView = new bo.ReadOnlyChildObject(
  'BlanketOrderScheduleView', properties, rules, extensions
);

module.exports = BlanketOrderScheduleView;
