'use strict';

var bo = require('../../../source/index.js');

var Properties = bo.shared.PropertyManager;
var Rules = bo.rules.RuleManager;
var Extensions = bo.shared.ExtensionManager;
var Property = bo.shared.PropertyInfo;
//var F = bo.shared.PropertyFlag;
var dt = bo.dataTypes;
var cr = bo.commonRules;

var quantity = new Property( 'quantity', dt.Integer );
var totalMass = new Property( 'totalMass', dt.Decimal );
var required = new Property( 'required', dt.Boolean );
var shipTo = new Property( 'shipTo', dt.Text );
var shipDate = new Property( 'shipDate', dt.DateTime );

var properties = new Properties(
    quantity,
    totalMass,
    required,
    shipTo,
    shipDate
);

var rules = new Rules(
    cr.required( quantity ),
    cr.required( totalMass ),
    cr.required( required ),
    cr.required( shipTo ),
    cr.required( shipDate )
);

//region Data portal methods

function dataFetch( ctx, dto, method ) {
  ctx.setValue( 'quantity',  dto.quantity );
  ctx.setValue( 'totalMass', dto.totalMass );
  ctx.setValue( 'required',  dto.required );
  ctx.setValue( 'shipTo',    dto.shipTo );
  ctx.setValue( 'shipDate',  dto.shipDate );
  ctx.fulfill( dto );
}

//endregion

var extensions = new Extensions( 'dal', __filename );
extensions.dataFetch = dataFetch;

var RescheduleShippingResult = bo.ReadOnlyChildObject( 'RescheduleShippingResult', properties, rules, extensions );

module.exports = RescheduleShippingResult;
