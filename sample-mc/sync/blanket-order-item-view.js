'use strict';

var bo = require('../../source/index.js');
var Model = bo.ModelComposerSync;
var F = bo.shared.PropertyFlag;

var BlanketOrderSchedulesView = require('./blanket-order-schedules-view.js');

var BlanketOrderItemView = Model('BlanketOrderItemView').readOnlyChildModel('dao', __filename)
    .integer('orderItemKey', F.key)
    .integer('orderKey', F.parentKey)
    .text('productName')
    .boolean('obsolete')
    .dateTime('expiry')
    .integer('quantity')
    .decimal('unitPrice')
    .property('schedules', BlanketOrderSchedulesView)
    .compose();

module.exports = BlanketOrderItemView;
