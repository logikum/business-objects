'use strict';

const bo = require( '../../source/index.js' );

const Properties = bo.shared.PropertyManager;
const Rules = bo.rules.RuleManager;
const Extensions = bo.shared.ExtensionManager;
const Property = bo.shared.PropertyInfo;
const F = bo.shared.PropertyFlag;
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

const extensions = new Extensions( 'dao', __filename );

const AddressView = new bo.ReadOnlyChildObject(
  'AddressView', properties, rules, extensions
);

module.exports = AddressView;
