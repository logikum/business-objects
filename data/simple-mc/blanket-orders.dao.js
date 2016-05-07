'use strict';

const DaoBase = require( '../../source/data-access/dao-base.js' );

const daoAddressCtor = require( './address.dao.js' );
const daoOrderItemCtor = require( './blanket-order-item.dao.js' );
const daoOrderScheduleCtor = require( './blanket-order-schedule.dao.js' );

const daoAddress = new daoAddressCtor();
const daoOrderItem = new daoOrderItemCtor();
const daoOrderSchedule = new daoOrderScheduleCtor();

class BlanketOrdersDao extends DaoBase {

  constructor() {
    super( 'BlanketOrdersDao' );
  }

  fetch( ctx ) {
    console.log( '--- Blanket orders DAO.fetch' );

    const orders = [];
    let totalOrders = 0;

    for (const key in global.orders) {
      if (global.orders.hasOwnProperty( key )) {
        const order = global.orders[ key ];
        orders.push( order );
        totalOrders++;
      }
    }

    return Promise.all( orders.map( order => {
        return daoAddress.$runMethod( 'fetchForOrder', ctx.connection, order.orderKey );
      } ) )
      .then( addresses => {
        for (let i = 0; i < adresses.length; i++) {
          orders[ i ].address = addresses[ i ];

          return daoOrderItem.$runMethod( 'fetchForOrder', ctx.connection, order.orderKey )
            .then( items => {
              orders[ i ].items = items;

              return Promise.all( items.map( item => {
                  return daoOrderSchedule.$runMethod( 'fetchForItem', ctx.connection, item.orderItemKey );
                } ) )
                .then( values => {
                  for (let j = 0; j < values.length; j++) {
                    order.items[ j ].schedules = values[ j ];
                  }
                  ctx.fulfill( orders );
                } )
            } );
        }
      } );
  }

  fetchFromTo( ctx, filter ) {
    console.log( '--- Blanket orders DAO.fetchFromTo' );

    const orders = [];
    let totalOrders = 0;

    for (const key in global.orders) {
      if (global.orders.hasOwnProperty( key )) {
        const order = global.orders[ key ];
        if (filter.from <= order.orderKey && order.orderKey <= filter.to) {
          orders.push( order );
          totalOrders++;
        }
      }
    }

    if (orders.length) {
      const promises = orders.map( order => {
        return daoAddress.$runMethod( 'fetchForOrder', ctx.connection, order.orderKey )
          .then( address => {
            order.address = address;

            return daoOrderItem.$runMethod( 'fetchForOrder', ctx.connection, order.orderKey )
              .then( items => {
                order.items = items;

                return Promise.all( items.map( item => {
                    return daoOrderSchedule.$runMethod( 'fetchForItem', ctx.connection, item.orderItemKey );
                  } ) )
                  .then( schedules => {
                    for (let i = 0; i < schedules.length; i++) {
                      order.items[ i ].schedules = schedules[ i ];
                    }
                  } );
              } );
          } );
      } );
      return Promise.all( promises )
        .then( values => {
          ctx.fulfill( orders );
        } );
    } else
      ctx.fulfill( orders );
  };
}

module.exports = BlanketOrdersDao;
