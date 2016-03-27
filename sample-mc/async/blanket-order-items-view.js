'use strict';

var bo = require('../../source/index.js');
var Model = bo.ModelComposer;

var BlanketOrderItemView = require('./blanket-order-item-view.js');

var BlanketOrderItemsView = Model('BlanketOrderItemsView').readOnlyChildCollection()
    .itemType(BlanketOrderItemView)
    .compose();

module.exports = BlanketOrderItemsView;
