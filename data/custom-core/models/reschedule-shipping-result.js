'use strict';

const bo = require( '../../../source/index.js' );

const Properties = bo.shared.PropertyManager;
const Rules = bo.rules.RuleManager;
const Extensions = bo.shared.ExtensionManager;
const Property = bo.shared.PropertyInfo;
//const F = bo.shared.PropertyFlag;
const dt = bo.dataTypes;
const cr = bo.commonRules;

const quantity = new Property( 'quantity', dt.Integer );
const totalMass = new Property( 'totalMass', dt.Decimal );
const required = new Property( 'required', dt.Boolean );
const shipTo = new Property( 'shipTo', dt.Text );
const shipDate = new Property( 'shipDate', dt.DateTime );

const properties = new Properties(
  quantity,
  totalMass,
  required,
  shipTo,
  shipDate
);

const rules = new Rules(
  cr.required( quantity ),
  cr.required( totalMass ),
  cr.required( required ),
  cr.required( shipTo ),
  cr.required( shipDate )
);

//region Data portal methods

function dataFetch( ctx, dto, method ) {
  ctx.setValue( 'quantity', dto.quantity );
  ctx.setValue( 'totalMass', dto.totalMass );
  ctx.setValue( 'required', dto.required );
  ctx.setValue( 'shipTo', dto.shipTo );
  ctx.setValue( 'shipDate', dto.shipDate );
  ctx.fulfill( dto );
}

//endregion

const extensions = new Extensions( 'dal', __filename );
extensions.dataFetch = dataFetch;

const RescheduleShippingResult = new bo.ReadOnlyChildObject(
  'RescheduleShippingResult', properties, rules, extensions
);

module.exports = RescheduleShippingResult;
