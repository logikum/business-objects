'use strict';

var bo = require('../../source/index.js');

var BlanketOrderItemView = require('./blanket-order-item-view.js');

var BlanketOrderItemsView = bo.ReadOnlyChildCollectionSync(
    'BlanketOrderItemsView',
    BlanketOrderItemView
);

module.exports = BlanketOrderItemsView;
