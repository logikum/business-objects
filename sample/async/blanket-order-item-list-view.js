'use strict';

var bo = require('../../source/index.js');

var BlanketOrderItemView = require('./blanket-order-item-view.js');

var BlanketOrderItemListView = bo.ReadOnlyCollection(
  'BlanketOrderItemListView',
  BlanketOrderItemView
);

module.exports = BlanketOrderItemListView;
