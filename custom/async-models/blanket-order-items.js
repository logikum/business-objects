'use strict';

var bo = require('../../source/index.js');

var BlanketOrderItem = require('./blanket-order-item.js');

var BlanketOrderItems = bo.EditableCollection(
  'BlanketOrderItems',
  BlanketOrderItem
);

module.exports = BlanketOrderItems;
