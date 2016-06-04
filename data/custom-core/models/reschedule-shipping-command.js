'use strict';

const bo = require( '../../../source/index.js' );
const daoBuilder = require( '../dao-builder.js' );

const Properties = bo.common.PropertyManager;
const Rules = bo.rules.RuleManager;
const Action = bo.rules.AuthorizationAction;
const Extensions = bo.common.ExtensionManager;
const Property = bo.common.PropertyInfo;
//const F = bo.common.PropertyFlag;
const dt = bo.dataTypes;
const cr = bo.commonRules;

const RescheduleShippingResult = require( './reschedule-shipping-result.js' );

const orderKey = new Property( 'orderKey', dt.Integer );
const orderItemKey = new Property( 'orderItemKey', dt.Integer );
const orderScheduleKey = new Property( 'orderScheduleKey', dt.Integer );
const success = new Property( 'success', dt.Boolean );
const result = new Property( 'result', RescheduleShippingResult );

const properties = new Properties(
  orderKey,
  orderItemKey,
  orderScheduleKey,
  success,
  result
);

const rules = new Rules(
  cr.required( orderKey ),
  cr.required( orderItemKey ),
  cr.required( orderScheduleKey ),
  cr.isInRole( Action.executeMethod, 'reschedule', 'developers', 'You are not authorized to execute the command.' )
);

//region Data portal methods

function dataExecute( ctx, method ) {
  function finish( dto ) {
    ctx.setValue( 'success', dto.success );
    ctx.fulfill( dto );
  }

  const dto = {
    orderKey: ctx.getValue( 'orderKey' ),
    orderItemKey: ctx.getValue( 'orderItemKey' ),
    orderScheduleKey: ctx.getValue( 'orderScheduleKey' )
  };
  if (method === 'reschedule')
    ctx.call( 'reschedule', dto ).then( finish );
  else
    ctx.execute( dto ).then( finish );
  // or:
  // ctx.call( method, dto ).then( finish );
}

//endregion

const extensions = new Extensions( 'dal', __filename );
extensions.daoBuilder = daoBuilder;
extensions.dataExecute = dataExecute;
extensions.addOtherMethod( 'reschedule' );

const RescheduleShippingCommand = new bo.CommandObject( 'RescheduleShippingCommand', properties, rules, extensions );

module.exports = RescheduleShippingCommand;
