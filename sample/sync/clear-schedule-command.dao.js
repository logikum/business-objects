'use strict';

var ClearScheduleCommandDao = function() {

  this.execute = function(data) {
    console.log('--- Clear schedule command DAO.execute');
    data.result = true;
    return data;
  };

};

module.exports = ClearScheduleCommandDao;
