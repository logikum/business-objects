'use strict';

var bo = require('../../source/index.js');
var Model = bo.ModelComposer;

var bo = require('../../source/index.js');
var F = bo.shared.PropertyFlag;

var BlanketOrderListItem = Model('BlanketOrderListItem').readOnlyChildModel('dao', __filename)
    .integer('orderKey', F.key)
    .text('vendorName')
    .dateTime('contractDate')
    .decimal('totalPrice')
    .integer('schedules')
    .boolean('enabled')
    .dateTime('createdDate')
    .dateTime('modifiedDate')
    .Compose();

module.exports = BlanketOrderListItem;
