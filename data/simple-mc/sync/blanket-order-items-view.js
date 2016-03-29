'use strict';

var bo = require('../../../source/index.js');
var Model = bo.ModelComposerSync;

var BlanketOrderItemView = require('./blanket-order-item-view.js');

var BlanketOrderItemsView = Model('BlanketOrderItemsView')
    .readOnlyChildCollection()
    // --- Collection elements
    .itemType(BlanketOrderItemView)
    // --- Build model class
    .compose();

module.exports = BlanketOrderItemsView;
