'use strict';

const bo = require( '../../../source/index.js' );
const Model = bo.ModelComposer;

const BlanketOrderItemView = require( './blanket-order-item-view.js' );

const BlanketOrderItemsView = Model( 'BlanketOrderItemsView' )
  .readOnlyChildCollection()
  // --- Collection elements
  .itemType( BlanketOrderItemView )
  // --- Build model class
  .compose();

module.exports = BlanketOrderItemsView;
