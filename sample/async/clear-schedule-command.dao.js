'use strict';

var ClearScheduleCommandDao = function() {

  this.execute = function(data, callback) {
    console.log('--- Clear schedule command DAO.execute');
    data.result = true;
    callback(null, data);
  };

};

module.exports = ClearScheduleCommandDao;
