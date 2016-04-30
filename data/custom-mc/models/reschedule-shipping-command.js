'use strict';

var bo = require('../../../source/index.js');
var daoBuilder = require('../dao-builder.js');
var Model = bo.ModelComposer;
var cr = bo.commonRules;

var RescheduleShippingResult = require('./reschedule-shipping-result.js');

//region Data portal methods

function dataExecute( ctx, method ) {
  function finish( dto ) {
    ctx.setValue( 'success', dto.success );
    ctx.fulfill( dto );
  }
  var dto = {
    orderKey:         ctx.getValue( 'orderKey' ),
    orderItemKey:     ctx.getValue( 'orderItemKey' ),
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

var RescheduleShippingCommand = Model('RescheduleShippingCommand')
    .commandObject('dal', __filename)
    // --- Properties
    .integer('orderKey')
        .required()
    .integer('orderItemKey')
        .required()
    .integer('orderScheduleKey')
        .required()
    .boolean('success')
    .property('result', RescheduleShippingResult)
    // --- Permissions
    .canCall('reschedule', cr.isInRole, 'developers', 'You are not authorized to execute the command.')
    // --- Customization
    .daoBuilder(daoBuilder)
    .dataExecute(dataExecute)
    .addMethod('reschedule')
    // --- Build model class
    .compose();

module.exports = RescheduleShippingCommand;
