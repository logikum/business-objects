'use strict';

var util = require('util');
var DaoBase = require('../../source/data-access/dao-base.js');

var ClearScheduleCommandDao = function() {
  ClearScheduleCommandDao.super_.call(this, 'ClearScheduleCommandDao');
};
util.inherits(ClearScheduleCommandDao, DaoBase);

ClearScheduleCommandDao.prototype.execute = function(connection, data) {
  console.log('--- Clear schedule command DAO.execute');

  return new Promise( (fulfill, reject) => {
    data.result = true;
    fulfill( data );
  });
};

module.exports = ClearScheduleCommandDao;
