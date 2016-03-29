'use strict';

var bo = require('../../../source/index.js');
var Model = bo.ModelComposer;
var F = bo.shared.PropertyFlag;

var BlanketOrderSchedulesView = require('./blanket-order-schedules-view.js');

var BlanketOrderItemView = Model('BlanketOrderItemView')
    .readOnlyChildObject('dao', __filename)
    // --- Properties
    .integer('orderItemKey', F.key)
    .integer('orderKey', F.parentKey)
    .text('productName')
    .boolean('obsolete')
    .dateTime('expiry')
    .integer('quantity')
    .decimal('unitPrice')
    .property('schedules', BlanketOrderSchedulesView)
    // --- Build model class
    .compose();

module.exports = BlanketOrderItemView;
