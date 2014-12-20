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

      order.items.create(function (err, item1) {
        if (err) throw err;

        item1.productName = 'Tablet Creek 7';
        item1.obsolete = false;
        item1.expiry = expiry1;
        item1.quantity = 2;
        item1.unitPrice = 200;

        order.items.create(function (err, item2) {
          if (err) throw err;

          item2.productName = 'USB 3.0 cable';
          item2.obsolete = false;
          item2.expiry = expiry2;
          item2.quantity = 5;
          item2.unitPrice = 19.5;

          item2.schedules.create(function (err, schedule1) {
            if (err) throw err;

            schedule1.quantity = 2;
            schedule1.totalMass = 0.24;
            schedule1.required = true;
            schedule1.shipTo = 'Madrid';
            schedule1.shipDate = shipDate1;

            item2.schedules.create(function (err, schedule2) {
              if (err) throw err;

              schedule2.quantity = 3;
              schedule2.totalMass = 0.36;
              schedule2.required = true;
              schedule2.shipTo = 'Copenhagen';
              schedule2.shipDate = shipDate2;

              save();
            });
          });
        });
      });

      //endregion

      function save() {

        order.save(function (err, order) {
          if (err) throw err;

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

          expect(order.items.count).toBe(2);

          var item1 = order.items.at(0);

          expect(item1.orderItemKey).toBe(1);
          expect(item1.orderKey).toBe(1);
          expect(item1.productName).toBe('Tablet Creek 7');
          expect(item1.obsolete).toBe(false);
          expect(item1.expiry).toBe(expiry1);
          expect(item1.quantity).toBe(2);
          expect(item1.unitPrice).toBe(200);

          var item2 = order.items.at(1);

          expect(item2.orderItemKey).toBe(2);
          expect(item2.orderKey).toBe(1);
          expect(item2.productName).toBe('USB 3.0 cable');
          expect(item2.obsolete).toBe(false);
          expect(item2.expiry).toBe(expiry2);
          expect(item2.quantity).toBe(5);
          expect(item2.unitPrice).toBe(19.5);

          expect(item1.schedules.count).toBe(0);

          expect(item2.schedules.count).toBe(2);

          var schedule1 = item2.schedules.at(0);

          expect(schedule1.orderScheduleKey).toBe(1);
          expect(schedule1.orderItemKey).toBe(2);
          expect(schedule1.quantity).toBe(2);
          expect(schedule1.totalMass).toBe(0.24);
          expect(schedule1.required).toBe(true);
          expect(schedule1.shipTo).toBe('Madrid');
          expect(schedule1.shipDate).toBe(shipDate1);

          var schedule2 = item2.schedules.at(1);

          expect(schedule2.orderScheduleKey).toBe(2);
          expect(schedule2.orderItemKey).toBe(2);
          expect(schedule2.quantity).toBe(3);
          expect(schedule2.totalMass).toBe(0.36);
          expect(schedule2.required).toBe(true);
          expect(schedule2.shipTo).toBe('Copenhagen');
          expect(schedule2.shipDate).toBe(shipDate2);

          //endregion

          done();
        });
      }
    });
  });

  it('special fetch', function (done) {
    console.log('\n*** Asynchronous GET_BY_NAME');

    BlanketOrder.getByName('Acme Corp.', function (err, order) {
      if (err) throw err;

      //region Check data

      expect(order.orderKey).toBe(1);
      expect(order.vendorName).toBe('Acme Corp.');
      expect(order.contractDate).toBe(contractDate);
      expect(order.totalPrice).toBe(497.5);
      expect(order.schedules).toBe(2);
      expect(order.enabled).toBe(true);
      expect(order.createdDate.getDate()).toBe(new Date().getDate());
      expect(order.modifiedDate).toBeNull();

      var address = order.address;

      expect(address.addressKey).toBe(1);
      expect(address.orderKey).toBe(1);
      expect(address.country).toBe('Canada');
      expect(address.state).toBe('Ontario');
      expect(address.city).toBe('Toronto');
      expect(address.line1).toBe('100 Front Street W');
      expect(address.line2).toBe('');
      expect(address.postalCode).toBe('M5J 1E3');

      expect(order.items.count).toBe(2);

      var item1 = order.items.at(0);

      expect(item1.orderItemKey).toBe(1);
      expect(item1.orderKey).toBe(1);
      expect(item1.productName).toBe('Tablet Creek 7');
      expect(item1.obsolete).toBe(false);
      expect(item1.expiry).toBe(expiry1);
      expect(item1.quantity).toBe(2);
      expect(item1.unitPrice).toBe(200);

      var item2 = order.items.at(1);

      expect(item2.orderItemKey).toBe(2);
      expect(item2.orderKey).toBe(1);
      expect(item2.productName).toBe('USB 3.0 cable');
      expect(item2.obsolete).toBe(false);
      expect(item2.expiry).toBe(expiry2);
      expect(item2.quantity).toBe(5);
      expect(item2.unitPrice).toBe(19.5);

      expect(item1.schedules.count).toBe(0);

      expect(item2.schedules.count).toBe(2);

      var schedule1 = item2.schedules.at(0);

      expect(schedule1.orderScheduleKey).toBe(1);
      expect(schedule1.orderItemKey).toBe(2);
      expect(schedule1.quantity).toBe(2);
      expect(schedule1.totalMass).toBe(0.24);
      expect(schedule1.required).toBe(true);
      expect(schedule1.shipTo).toBe('Madrid');
      expect(schedule1.shipDate).toBe(shipDate1);

      var schedule2 = item2.schedules.at(1);

      expect(schedule2.orderScheduleKey).toBe(2);
      expect(schedule2.orderItemKey).toBe(2);
      expect(schedule2.quantity).toBe(3);
      expect(schedule2.totalMass).toBe(0.36);
      expect(schedule2.required).toBe(true);
      expect(schedule2.shipTo).toBe('Copenhagen');
      expect(schedule2.shipDate).toBe(shipDate2);

      //endregion

      done();
    });
  });
});
