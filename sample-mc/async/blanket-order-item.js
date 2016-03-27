'use strict';

var bo = require('../../source/index.js');
var Model = bo.ModelComposer;
var F = bo.shared.PropertyFlag;

var BlanketOrderSchedules = require('./blanket-order-schedules.js');

var BlanketOrderItem = Model('BlanketOrderItem').editableChildModel('dao', __filename)
    .integer('orderItemKey', F.key | F.readOnly)
    .integer('orderKey', F.parentKey | F.readOnly)
    .text('productName')
        .required()
    .boolean('obsolete')
        .required()
    .dateTime('expiry')
        .required()
    .integer('quantity')
        .required()
    .decimal('unitPrice')
        .required()
    .property('schedules', BlanketOrderSchedules)
    .compose();

module.exports = BlanketOrderItem;
