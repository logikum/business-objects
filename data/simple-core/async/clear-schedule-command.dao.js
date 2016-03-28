'use strict';

var util = require('util');
var DaoBase = require('../../../source/data-access/dao-base.js');

var ClearScheduleCommandDao = function() {
  ClearScheduleCommandDao.super_.call(this, 'ClearScheduleCommandDao');
};
util.inherits(ClearScheduleCommandDao, DaoBase);

ClearScheduleCommandDao.prototype.execute = function(connection, data, callback) {
  console.log('--- Clear schedule command DAO.execute');

  data.result = true;
  callback(null, data);
};

module.exports = ClearScheduleCommandDao;
