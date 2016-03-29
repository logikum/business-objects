'use strict';

var bo = require('../../../source/index.js');
var Model = bo.ModelComposer;
var F = bo.shared.PropertyFlag;

var BlanketOrderSchedule = Model('BlanketOrderSchedule')
    .editableChildModel('dao', __filename)
    // --- Properties
    .integer('orderScheduleKey', F.key | F.readOnly)
    .integer('orderItemKey', F.parentKey | F.readOnly)
    .integer('quantity')
        .required()
    .decimal('totalMass')
        .required()
    .boolean('required')
        .required()
    .text('shipTo')
        .required()
    .dateTime('shipDate')
        .required()
    // --- Build model class
    .compose();

module.exports = BlanketOrderSchedule;
