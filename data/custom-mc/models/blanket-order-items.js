'use strict';

const bo = require( '../../../source/index.js' );
const Model = bo.ModelComposer;

const BlanketOrderItem = require( './blanket-order-item.js' );

const BlanketOrderItems = Model( 'BlanketOrderItems' )
  .editableChildCollection()
  // --- Collection elements
  .itemType( BlanketOrderItem )
  // --- Build model class
  .compose();

module.exports = BlanketOrderItems;
