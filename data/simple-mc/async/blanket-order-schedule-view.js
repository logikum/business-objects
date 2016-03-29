'use strict';

var bo = require('../../../source/index.js');
var Model = bo.ModelComposer;
var F = bo.shared.PropertyFlag;

var BlanketOrderScheduleView = Model('BlanketOrderScheduleView')
    .readOnlyChildObject('dao', __filename)
    // --- Properties
    .integer('orderScheduleKey', F.key)
    .integer('orderItemKey', F.parentKey)
    .integer('quantity')
    .decimal('totalMass')
    .boolean('required')
    .text('shipTo')
    .dateTime('shipDate')
    // --- Build model class
    .compose();

module.exports = BlanketOrderScheduleView;
