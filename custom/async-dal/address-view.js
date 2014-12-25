'use strict';

var AddressViewDao = function() {

  this.fetch = function(filter, callback) {
    console.log('--- Blanket order address view DAO.fetch');
    for (var key in global.addresses) {
      if (global.addresses.hasOwnProperty(key)) {
        var data = global.addresses[key];
        if (data.orderKey === filter){
          callback(null, data);
          return;
        }
      }
    }
    callback(null, {});
  };

};

module.exports = AddressViewDao;
