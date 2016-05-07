'use strict';

const DaoBase = require( '../../../source/data-access/dao-base.js' );

class BlanketOrderScheduleDao extends DaoBase {

  constructor() {
    super( 'BlanketOrderScheduleDao' );
  }

  create( ctx ) {
    console.log( '--- Blanket order schedule DAO.create' );

    ctx.fulfill( {
      quantity: 0,
      totalMass: 0.0,
      required: true,
      shipTo: '',
      shipDate: new Date( 1980, 1, 1 )
    } );
  }

  /* Special fetch method for test circumstances. */
  fetchForItem( ctx, filter ) {
    console.log( '--- Blanket order schedule DAO.fetchForItem' );

    const schedules = [];
    for (const key in global.schedules) {
      if (global.schedules.hasOwnProperty( key )) {
        const schedule = global.schedules[ key ];
        if (schedule.orderItemKey === filter)
          schedules.push( schedule );
      }
    }
    ctx.fulfill( schedules );
  }

  insert( ctx, data ) {
    console.log( '--- Blanket order schedule DAO.insert' );

    data.orderScheduleKey = ++global.scheduleKey;
    global.schedules[ data.orderScheduleKey ] = data;
    ctx.fulfill( data );
  }

  update( ctx, data ) {
    console.log( '--- Blanket order schedule DAO.update' );

    if (!global.schedules[ data.orderScheduleKey ])
      ctx.reject( new Error( 'Blanket order schedule not found.' ) );
    else {
      global.schedules[ data.orderScheduleKey ] = data;
      ctx.fulfill( data );
    }
  }

  remove( ctx, filter ) {
    console.log( '--- Blanket order schedule DAO.remove' );

    if (global.schedules[ filter ])
      delete global.schedules[ filter ];
    ctx.fulfill( null );
  }
}

module.exports = BlanketOrderScheduleDao;
