'use strict';

var AddressDao = function() {

  this.fetch = function(filter) {
    console.log('--- Blanket order address view DAO.fetch');
    for (var key in global.addresses) {
      if (global.addresses.hasOwnProperty(key)) {
        var data = global.addresses[key];
        if (data.orderKey === filter)
          return data;
      }
    }
    return {};
  };

};

module.exports = AddressDao;
