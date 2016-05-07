'use strict';

const DaoBase = require( '../../../source/data-access/dao-base.js' );

const daoAddressCtor = require( './address.js' );
const daoOrderItemCtor = require( './blanket-order-item.js' );
const daoOrderScheduleCtor = require( './blanket-order-schedule.js' );

const daoAddress = new daoAddressCtor();
const daoOrderItem = new daoOrderItemCtor();
const daoOrderSchedule = new daoOrderScheduleCtor();

class BlanketOrderDao extends DaoBase {

  constructor() {
    super( 'BlanketOrderDao' );
  }

  create( ctx ) {
    console.log( '--- Blanket order DAO.create' );

    ctx.fulfill( {
      vendorName: '',
      contractDate: new Date( 1980, 1, 1 ),
      totalPrice: 0.0,
      schedules: 0,
      enabled: true
    } );
  }

  fetch( ctx, filter ) {
    console.log( '--- Blanket order DAO.fetch' );

    const key = filter;
    if (!global.orders[ key ]) {
      ctx.reject( new Error( 'Blanket order not found.' ) );
      return;
    }

    const order = global.orders[ key ];
    return daoAddress.$runMethod( 'fetchForOrder', ctx.connection, order.orderKey )
      .then( address => {
        order.address = address;

        return daoOrderItem.$runMethod( 'fetchForOrder', ctx.connection, order.orderKey )
          .then( items => {
            order.items = items;

            return Promise.all( items.map( item => {
                return daoOrderSchedule.$runMethod( 'fetchForItem', ctx.connection, item.orderItemKey );
              } ) )
              .then( values => {
                for (let i = 0; i < values.length; i++) {
                  order.items[ i ].schedules = values[ i ];
                }
                ctx.fulfill( order );
              } );
          } );
      } );
  }

  fetchByName( ctx, filter ) {
    console.log( '--- Blanket order DAO.fetchByName' );

    let found = false;
    for (const key in global.orders) {
      if (global.orders.hasOwnProperty( key )) {
        const order = global.orders[ key ];
        if (order.vendorName === filter) {
          found = true;

          return daoAddress.$runMethod( 'fetchForOrder', ctx.connection, order.orderKey )
            .then( address => {
              order.address = address;

              return daoOrderItem.$runMethod( 'fetchForOrder', ctx.connection, order.orderKey )
                .then( items => {
                  order.items = items;

                  return Promise.all( items.map( item => {
                      return daoOrderSchedule.$runMethod( 'fetchForItem', ctx.connection, item.orderItemKey );
                    } ) )
                    .then( values => {
                      for (let i = 0; i < values.length; i++) {
                        order.items[ i ].schedules = values[ i ];
                      }
                      ctx.fulfill( order );
                    } );
                } );
            } );
        }
      }
    }
    if (!found)
      ctx.reject( new Error( 'Blanket order not found.' ) );
  }

  insert( ctx, data ) {
    console.log( '--- Blanket order DAO.insert' );

    data.orderKey = ++global.orderKey;
    data.createdDate = new Date();
    const key = data.orderKey;
    global.orders[ key ] = data;
    ctx.fulfill( data );
  }

  update( ctx, data ) {
    console.log( '--- Blanket order DAO.update' );

    const key = data.orderKey;
    if (!global.orders[ key ])
      ctx.reject( new Error( 'Blanket order not found.' ) );
    else {
      data.modifiedDate = new Date();
      global.orders[ key ] = data;
      ctx.fulfill( data );
    }
  }

  remove( ctx, filter ) {
    console.log( '--- Blanket order DAO.remove' );

    const key = filter;
    if (global.orders[ key ])
      delete global.orders[ key ];
    ctx.fulfill( null );
  }
}

module.exports = BlanketOrderDao;
