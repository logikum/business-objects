'use strict';

var bo = require('../../source/index.js');

var BlanketOrderItemView = require('./blanket-order-item-view.js');

var BlanketOrderItemsView = bo.ReadOnlyChildCollection(
  'BlanketOrderItemsView',
  BlanketOrderItemView
);

module.exports = BlanketOrderItemsView;
