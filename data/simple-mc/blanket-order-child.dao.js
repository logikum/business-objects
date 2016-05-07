'use strict';

const DaoBase = require( '../../source/data-access/dao-base.js' );

class BlanketOrderChildDao extends DaoBase {

  constructor() {
    super( 'BlanketOrderChildDao' );
  }

  create( ctx ) {
    console.log( '--- Blanket order child DAO.create' );

    ctx.fulfill( {} );
  }

  insert( ctx, data ) {
    console.log( '--- Blanket order child DAO.insert' );

    data.orderKey = ++global.orderKey;
    data.createdDate = new Date();
    const key = data.orderKey;
    global.orders[ key ] = data;
    ctx.fulfill( data );
  }

  update( ctx, data ) {
    console.log( '--- Blanket order child DAO.update' );

    const key = data.orderKey;
    if (!global.orders[ key ])
      ctx.reject( new Error( 'Blanket order child not found.' ) );
    else {
      data.modifiedDate = new Date();
      global.orders[ key ] = data;
      ctx.fulfill( data );
    }
  }

  remove( ctx, filter ) {
    console.log( '--- Blanket order child DAO.remove' );

    const key = filter;
    if (global.orders[ key ])
      delete global.orders[ key ];
    ctx.fulfill( null );
  }
}

module.exports = BlanketOrderChildDao;
