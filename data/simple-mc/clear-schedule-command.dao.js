'use strict';

var util = require('util');
var DaoBase = require('../../source/data-access/dao-base.js');

var ClearScheduleCommandDao = function() {
  ClearScheduleCommandDao.super_.call(this, 'ClearScheduleCommandDao');
};
util.inherits(ClearScheduleCommandDao, DaoBase);

ClearScheduleCommandDao.prototype.execute = function( ctx, data ) {
  console.log('--- Clear schedule command DAO.execute');

  data.result = true;
  ctx.fulfill( data );
};

module.exports = ClearScheduleCommandDao;
