'use strict';

const bo = require( '../../../source/index.js' );

const BlanketOrderItem = require( './blanket-order-item.js' );

const BlanketOrderItems = new bo.EditableChildCollection(
  'BlanketOrderItems',
  BlanketOrderItem
);

module.exports = BlanketOrderItems;
