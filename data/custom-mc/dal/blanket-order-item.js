'use strict';

const DaoBase = require( '../../../source/data-access/dao-base.js' );

class BlanketOrderItemDao extends DaoBase {

  constructor() {
    super( 'BlanketOrderItemDao' );
  }

  create( ctx ) {
    console.log( '--- Blanket order item DAO.create' );

    ctx.fulfill( {
      productName: '',
      obsolete: false,
      expiry: new Date( 1980, 1, 1 ),
      quantity: 0,
      unitPrice: 0.0
    } );
  }

  /* Special fetch method for test circumstances. */
  fetchForOrder( ctx, filter ) {
    console.log( '--- Blanket order item DAO.fetchForOrder' );

    const items = [];
    for (var key in global.items) {
      if (global.items.hasOwnProperty( key )) {
        const item = global.items[ key ];
        if (item.orderKey === filter)
          items.push( item );
      }
    }
    ctx.fulfill( items );
  }

  insert( ctx, data ) {
    console.log( '--- Blanket order item DAO.insert' );

    data.orderItemKey = ++global.itemKey;
    global.items[ data.orderItemKey ] = data;
    ctx.fulfill( data );
  }

  update( ctx, data ) {
    console.log( '--- Blanket order item DAO.update' );

    if (!global.items[ data.orderItemKey ])
      ctx.reject( new Error( 'Blanket order item not found.' ) );
    else {
      global.items[ data.orderItemKey ] = data;
      ctx.fulfill( data );
    }
  }

  remove( ctx, filter ) {
    console.log( '--- Blanket order item DAO.remove' );

    if (global.items[ filter ])
      delete global.items[ filter ];
    ctx.fulfill( null );
  }
}

module.exports = BlanketOrderItemDao;
