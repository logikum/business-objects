'use strict';

var bo = require('../../source/index.js');
var Model = bo.ModelComposer;

var BlanketOrderItemView = require('./blanket-order-item.js');

var BlanketOrderItemsView = Model('BlanketOrderItemsView').readOnlyChildCollection()
    .itemType(BlanketOrderItemView)
    .Compose();

module.exports = BlanketOrderItemsView;
