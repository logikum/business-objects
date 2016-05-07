'use strict';

const bo = require( '../../source/index.js' );
const Model = bo.ModelComposer;

const BlanketOrderChild = require( './blanket-order-child.js' );

const BlanketOrders = Model( 'BlanketOrders' )
  .editableRootCollection( 'dao', __filename )
  // --- Collection elements
  .itemType( BlanketOrderChild )
  // --- Build model class
  .compose();

const BlanketOrdersFactory = {
  create: function ( eventHandlers ) {
    return BlanketOrders.create( eventHandlers );
  },
  getAll: function ( eventHandlers ) {
    return BlanketOrders.fetch( null, null, eventHandlers );
  },
  getFromTo: function ( from, to, eventHandlers ) {
    return BlanketOrders.fetch( { from: from, to: to }, 'fetchFromTo', eventHandlers );
  }
};

module.exports = BlanketOrdersFactory;
