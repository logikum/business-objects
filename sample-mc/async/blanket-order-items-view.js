'use strict';

var Model = require('../../source/model-composer.js');

var BlanketOrderItemView = require('./blanket-order-item.js');

var BlanketOrderItemsView = Model('BlanketOrderItemsView').readOnlyChildCollection()
    .itemType(BlanketOrderItemView)
    .Compose();

module.exports = BlanketOrderItemsView;
