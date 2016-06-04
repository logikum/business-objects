'use strict';

const bo = require( '../../source/index.js' );

const Properties = bo.common.PropertyManager;
const Rules = bo.rules.RuleManager;
const Extensions = bo.common.ExtensionManager;
const Property = bo.common.PropertyInfo;
const F = bo.common.PropertyFlag;
const dt = bo.dataTypes;
const cr = bo.commonRules;

const addressKey = new Property( 'addressKey', dt.Integer, F.key | F.readOnly );
const orderKey = new Property( 'orderKey', dt.Integer, F.parentKey | F.readOnly );
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
  cr.required( country ),
  cr.required( city ),
  cr.required( line1 ),
  cr.required( postalCode )
);

const extensions = new Extensions( 'dao', __filename );

const Address = new bo.EditableChildObject( 'Address', properties, rules, extensions );

module.exports = Address;
