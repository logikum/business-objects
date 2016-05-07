'use strict';

const bo = require( '../../source/index.js' );
const Model = bo.ModelComposer;

const BlanketOrderListItem = require( './blanket-order-list-item.js' );

const BlanketOrderList = Model( 'BlanketOrderList' )
  .readOnlyRootCollection( 'dao', __filename )
  // --- Collection elements
  .itemType( BlanketOrderListItem )
  // --- Build model class
  .compose();

const BlanketOrderListFactory = {
  getAll: function ( eventHandlers ) {
    return BlanketOrderList.fetch( null, null, eventHandlers );
  },
  getByName: function ( name, eventHandlers ) {
    return BlanketOrderList.fetch( name, 'fetchByName', eventHandlers );
  }
};

module.exports = BlanketOrderListFactory;
