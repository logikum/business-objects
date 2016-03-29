'use strict';

var bo = require('../../../source/index.js');
var Model = bo.ModelComposer;

var bo = require('../../../source/index.js');
var F = bo.shared.PropertyFlag;

var BlanketOrderListItem = Model('BlanketOrderListItem')
    .readOnlyChildObject('dao', __filename)
    // --- Properties
    .integer('orderKey', F.key)
    .text('vendorName')
    .dateTime('contractDate')
    .decimal('totalPrice')
    .integer('schedules')
    .boolean('enabled')
    .dateTime('createdDate')
    .dateTime('modifiedDate')
    // --- Build model class
    .compose();

module.exports = BlanketOrderListItem;
