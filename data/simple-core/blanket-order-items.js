'use strict';

const bo = require( '../../source/index.js' );

const BlanketOrderItem = require( './blanket-order-item.js' );

const BlanketOrderItems = bo.EditableChildCollection(
  'BlanketOrderItems',
  BlanketOrderItem
);

module.exports = BlanketOrderItems;
