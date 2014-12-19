"use strict";

console.log('Testing data portal methods of asynchronous models.js...');

var BlanketOrder = require('../sample/async/blanket-order.js');

var contractDate = new Date(2014, 12, 15, 15, 26);
var contractDate_u = new Date(2014, 12, 20, 8, 40);
var expiry1 = new Date(2015, 1, 1, 0, 0);
var expiry2 = new Date(2015, 3, 21, 0, 0);
var shipDate1 = new Date(2015, 1, 8, 12, 0);
var shipDate2 = new Date(2015, 2, 28, 16, 30);

describe('Asynchronous data portal method', function () {

  it('create action works', function (done) {
    console.log('\n*** Asynchronous CREATE');

    BlanketOrder.create(function (err, order) {
      if (err) throw err;

      //region Load data

      order.vendorName = 'Acme Corp.';
      order.contractDate = contractDate;
      order.totalPrice = 497.5;
      order.schedules = 2;
      order.enabled = true;

      var address = order.address;

      address.country = 'Canada';
      address.state = 'Ontario';
      address.city = 'Toronto';
      address.line1 = '100 Front Street W';
      address.line2 = '';
      address.postalCode = 'M5J 1E3';

      //endregion

      order.save(function (err, order) {

        //region Check data

        expect(order.orderKey).toBe(1);
        expect(order.vendorName).toBe('Acme Corp.');
        expect(order.contractDate).toBe(contractDate);
        expect(order.totalPrice).toBe(497.5);
        expect(order.schedules).toBe(2);
        expect(order.enabled).toBe(true);
        expect(order.createdDate.getDate()).toBe(new Date().getDate());
        expect(order.modifiedDate).toBeNull();

        address = order.address;

        expect(address.addressKey).toBe(1);
        expect(address.orderKey).toBe(1);
        expect(address.country).toBe('Canada');
        expect(address.state).toBe('Ontario');
        expect(address.city).toBe('Toronto');
        expect(address.line1).toBe('100 Front Street W');
        expect(address.line2).toBe('');
        expect(address.postalCode).toBe('M5J 1E3');

        //endregion

        done();
      });
    });
  });
});
