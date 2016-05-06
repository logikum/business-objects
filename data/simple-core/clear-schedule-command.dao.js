'use strict';

const DaoBase = require( '../../source/data-access/dao-base.js' );

class ClearScheduleCommandDao extends DaoBase {
  constructor() {
    super( 'ClearScheduleCommandDao' );
  }
  execute( ctx, data ) {
    console.log('--- Clear schedule command DAO.execute');

    data.result = true;
    ctx.fulfill( data );
  }
}

module.exports = ClearScheduleCommandDao;
