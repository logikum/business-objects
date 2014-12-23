'use strict';

var bo = require('../../source/index.js');

var BlanketOrderItemView = require('./blanket-order-item-view.js');

var BlanketOrderItemListView = bo.ReadOnlyCollectionSync(
  'BlanketOrderItemListView',
  BlanketOrderItemView
);

module.exports = BlanketOrderItemListView;
