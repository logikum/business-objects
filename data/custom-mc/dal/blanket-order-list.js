'use strict';

const DaoBase = require( '../../../source/data-access/dao-base.js' );

class BlanketOrderListDao extends DaoBase {

  constructor() {
    super( 'BlanketOrderListDao' );
  }

  fetch( ctx, filter ) {
    console.log( '--- Blanket order list DAO.fetch' );

    const orderList = [];
    for (const key in global.orders) {
      if (global.orders.hasOwnProperty( key )) {
        orderList.push( global.orders[ key ] );
      }
    }
    orderList.totalItems = 2015;
    ctx.fulfill( orderList );
  };

  fetchByName( ctx, filter ) {
    console.log( '--- Blanket order list DAO.fetchByName' );

    const orderList = [];
    for (const key in global.orders) {
      if (global.orders.hasOwnProperty( key )) {
        const order = global.orders[ key ];
        if (order.vendorName === filter)
          orderList.push();
      }
    }
    ctx.fulfill( orderList );
  }
}

module.exports = BlanketOrderListDao;
