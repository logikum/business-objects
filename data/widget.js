'use strict';

const bo = require( '../source/index.js' );

const Properties = bo.common.PropertyManager;
const Rules = bo.rules.RuleManager;
const Extensions = bo.common.ExtensionManagerSync;
const Property = bo.common.PropertyInfo;
const F = bo.common.PropertyFlag;
const dt = bo.dataTypes;
const cr = bo.commonRules;

const key = new Property( 'key', dt.Integer, F.key | F.readOnly );
const description = new Property( 'description', dt.Text );

const properties = new Properties(
  'Widget',
  key,
  description
);

const rules = new Rules(
  cr.required( key )
);

const extensions = new Extensions( 'dao', __filename );

const Widget = bo.CommandObjectSync( properties, rules, extensions );

module.exports = Widget;
