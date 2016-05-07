'use strict';

const DaoBase = require( '../../source/data-access/dao-base.js' );

class AddressDao extends DaoBase {

  constructor() {
    super( 'AddressDao' );
  }

  create( ctx ) {
    console.log( '--- Blanket order address DAO.create' );

    ctx.fulfill( {} );
  }

  /* Special fetch method for test circumstances. */
  fetchForOrder( ctx, filter ) {
    console.log( '--- Blanket order address DAO.fetch' );

    for (const key in global.addresses) {
      if (global.addresses.hasOwnProperty( key )) {
        const data = global.addresses[ key ];
        if (data.orderKey === filter){
          ctx.fulfill( data );
          return;
        }
      }
    }
    ctx.reject( {} )
  }

  insert( ctx, data ) {
    console.log( '--- Blanket order address DAO.insert' );

    data.addressKey = ++global.addressKey;
    const key = data.addressKey;
    global.addresses[ key ] = data;
    ctx.fulfill( data );
  }

  update( ctx, data ) {
    console.log( '--- Blanket order address DAO.update' );

    const key = data.addressKey;
    if (!global.addresses[ key ])
      ctx.reject( new Error( 'Blanket order address not found.' ));
    else {
      global.addresses[ key ] = data;
      ctx.fulfill( data );
    }
  }

  remove( ctx, filter ) {
    console.log( '--- Blanket order address DAO.remove' );

    const key = filter;
    if (global.addresses[key])
      delete global.addresses[key];
    ctx.fulfill( null );
  }
}

module.exports = AddressDao;
