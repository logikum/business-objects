'use strict';

const DaoBase = require( '../../../source/data-access/dao-base.js' );

class BlanketOrderViewDao extends DaoBase {

  constructor() {
    super( 'BlanketOrderViewDao' );
  }

  fetch( ctx, filter ) {
    console.log( '--- Blanket order view DAO.fetch' );

    if (global.t06order)
      ctx.fulfill( global.t06order );
    else
      ctx.reject( new Error( 'Blanket order not found.' ) );
  }
}

module.exports = BlanketOrderViewDao;
