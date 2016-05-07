'use strict';

const DaoBase = require( '../source/data-access/dao-base.js' );

class WidgetDao extends DaoBase {

  constructor() {
    super( 'WidgetDao' );
  }

  select( ctx, data ) {
    return 'Hello, world!';
  }
}

module.exports = WidgetDao;
