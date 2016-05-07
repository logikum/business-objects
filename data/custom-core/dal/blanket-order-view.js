'use strict';

const DaoBase = require( '../../../source/data-access/dao-base.js' );

const daoAddressCtor = require( './address.js' );
const daoOrderItemCtor = require( './blanket-order-item.js' );
const daoOrderScheduleCtor = require( './blanket-order-schedule.js' );

const daoAddress = new daoAddressCtor();
const daoOrderItem = new daoOrderItemCtor();
const daoOrderSchedule = new daoOrderScheduleCtor();

class BlanketOrderViewDao extends DaoBase {

  constructor() {
    super( 'BlanketOrderViewDao' );
  }

  fetch( ctx, filter ) {
    console.log( '--- Blanket order view DAO.fetch' );

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
    console.log( '--- Blanket order view DAO.fetchByName' );

    let found = false;
    for (const key in global.orders) {
      if (global.orders.hasOwnProperty( key )) {
        let order = global.orders[ key ];
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
}

module.exports = BlanketOrderViewDao;
