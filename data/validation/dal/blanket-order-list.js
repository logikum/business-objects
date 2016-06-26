'use strict';

const DaoBase = require( '../../../source/data-access/dao-base.js' );

class BlanketOrderListDao extends DaoBase {

  constructor() {
    super( 'BlanketOrderListDao' );
  }

  fetch( ctx, filter ) {
    console.log( '--- Blanket order list DAO.fetch' );

    if (global.t06orders)
      ctx.fulfill( global.t06orders );
    else
      ctx.reject( new Error( 'Blanket order not found.' ) );
  }
}

module.exports = BlanketOrderListDao;
