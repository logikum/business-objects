'use strict';

var bo = require('../../../source/index.js');
var Model = bo.ModelComposerSync;
var F = bo.shared.PropertyFlag;

var BlanketOrderScheduleView = Model('BlanketOrderScheduleView').readOnlyChildModel('dao', __filename)
    .integer('orderScheduleKey', F.key)
    .integer('orderItemKey', F.parentKey)
    .integer('quantity')
    .decimal('totalMass')
    .boolean('required')
    .text('shipTo')
    .dateTime('shipDate')
    .compose();

module.exports = BlanketOrderScheduleView;
