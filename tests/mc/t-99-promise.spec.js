var BlanketOrders = require('../../data/simple-mc/async/blanket-orders.js');

var contractDate1 = new Date(2015, 10, 23, 11, 7);
var contractDate2 = new Date(2015, 10, 24, 15, 48);
var contractDate3 = new Date(2015, 11, 7, 19, 0);
var expiry1 = new Date(2016, 7, 1, 0, 0);
var expiry2 = new Date(2016, 4, 1, 0, 0);
var expiry3 = new Date(2016, 8, 20, 12, 0);
var shipDate1 = new Date(2015, 12, 21, 12, 0);
var shipDate2 = new Date(2016, 1, 12, 9, 45);
var shipDate3 = new Date(2016, 2, 5, 17, 0);

describe('Test test', function () {

  it('test', function ( done ) {

    //region Load data

    function createOrder1( list ) {
      return list.createItem().then( order1 => {

        order1.vendorName = 'Blue Zebra';
        order1.contractDate = contractDate1;
        order1.totalPrice = 400.0;
        order1.schedules = 2;
        order1.enabled = true;

        var address1 = order1.address;

        address1.country = 'Italia';
        address1.state = '';
        address1.city = 'Milano';
        address1.line1 = 'Via Battistotti Sassi 11/A';
        address1.line2 = '';
        address1.postalCode = '20133';

        return Promise.all([
          createItem1( order1.items ),
          createItem2( order1.items )
        ]).then( items => {
          return order1;
        });
      });
    }
    function createOrder2( list ) {
      return list.createItem().then( order2 => {

        order2.vendorName = 'Black Spider';
        order2.contractDate = contractDate2;
        order2.totalPrice = 6600.0;
        order2.schedules = 3;
        order2.enabled = true;

        var address2 = order2.address;

        address2.country = 'Poland';
        address2.state = '';
        address2.city = 'Warsawa';
        address2.line1 = 'ul. Żeromskiego 77';
        address2.line2 = 'III piętro';
        address2.postalCode = '01-882';

        createItem3( order2.items ).then( item3 => {
          return order2;
        });
      });
    }
    function createItem1( items ) {
      return items.createItem().then( item1 => {

        item1.productName = 'D810A';
        item1.obsolete = false;
        item1.expiry = expiry1;
        item1.quantity = 10;
        item1.unitPrice = 30;

        return Promise.all([
          createSchedule1( item1.schedules ),
          createSchedule2( item1.schedules )
        ]).then( schedules => {
          return item1;
        });
      });
    }
    function createItem2( items ) {
      return items.createItem().then( item2 => {

        item2.productName = 'R8';
        item2.obsolete = false;
        item2.expiry = expiry2;
        item2.quantity = 5;
        item2.unitPrice = 20;

        return item2;
      });
    }
    function createItem3( items ) {
      return items.createItem().then( item3 => {

        item3.productName = 'Platforma SIRP';
        item3.obsolete = false;
        item3.expiry = expiry3;
        item3.quantity = 110;
        item3.unitPrice = 60;

        createSchedule3( item3.schedules ).then( schedule3 => {
          return item3;
        });
      });
    }
    function createSchedule1( schedules ) {
      return schedules.createItem().then( schedule1 => {

        schedule1.quantity = 5;
        schedule1.totalMass = 2.5;
        schedule1.required = true;
        schedule1.shipTo = 'Bologna';
        schedule1.shipDate = shipDate1;

        return schedule1;
      });
    }
    function createSchedule2( schedules ) {
      return schedules.createItem().then( schedule2 => {

        schedule2.quantity = 5;
        schedule2.totalMass = 2.5;
        schedule2.required = true;
        schedule2.shipTo = 'Verona';
        schedule2.shipDate = shipDate2;

        return schedule2;
      });
    }
    function createSchedule3( schedules ) {
      return schedules.createItem().then( schedule3 => {

        schedule3.quantity = 45;
        schedule3.totalMass = 540;
        schedule3.required = false;
        schedule3.shipTo = 'Krakow';
        schedule3.shipDate = shipDate3;

        return schedule3;
      });
    }

    //endregion

    BlanketOrders.create().then( list => {
        return Promise.all([
          createOrder1( list ),
          createOrder2( list )
        ]).then( orders => {
          return list;
        });
      }).then( list => {
        return list.save().then( orders => {

          //region Check data

          expect(orders.count).toBe(2);

          /* ---------------------------------------- */

          var order1 = orders.at(0);

          expect(order1.orderKey).toBe(12);
          expect(order1.vendorName).toBe('Blue Zebra');
          expect(order1.contractDate).toBe(contractDate1);
          expect(order1.totalPrice).toBe(400.0);
          expect(order1.schedules).toBe(2);
          expect(order1.enabled).toBe(true);
          expect(order1.createdDate.getDate()).toBe(new Date().getDate());
          expect(order1.modifiedDate).toBeNull();

          address1 = order1.address;

          expect(address1.addressKey).toBe(12);
          expect(address1.orderKey).toBe(12);
          expect(address1.country).toBe('Italia');
          expect(address1.state).toBe('');
          expect(address1.city).toBe('Milano');
          expect(address1.line1).toBe('Via Battistotti Sassi 11/A');
          expect(address1.line2).toBe('');
          expect(address1.postalCode).toBe('20133');

          expect(order1.items.count).toBe(2);

          item1 = order1.items.at(0);

          expect(item1.orderItemKey).toBe(31);
          expect(item1.orderKey).toBe(12);
          expect(item1.productName).toBe('D810A');
          expect(item1.obsolete).toBe(false);
          expect(item1.expiry).toBe(expiry1);
          expect(item1.quantity).toBe(10);
          expect(item1.unitPrice).toBe(30);

          item2 = order1.items.at(1);

          expect(item2.orderItemKey).toBe(32);
          expect(item2.orderKey).toBe(12);
          expect(item2.productName).toBe('R8');
          expect(item2.obsolete).toBe(false);
          expect(item2.expiry).toBe(expiry2);
          expect(item2.quantity).toBe(5);
          expect(item2.unitPrice).toBe(20);

          expect(item1.schedules.count).toBe(2);

          expect(item2.schedules.count).toBe(0);

          schedule1 = item1.schedules.at(0);

          expect(schedule1.orderScheduleKey).toBe(40);
          expect(schedule1.orderItemKey).toBe(31);
          expect(schedule1.quantity).toBe(5);
          expect(schedule1.totalMass).toBe(2.5);
          expect(schedule1.required).toBe(true);
          expect(schedule1.shipTo).toBe('Bologna');
          expect(schedule1.shipDate).toBe(shipDate1);

          schedule2 = item1.schedules.at(1);

          expect(schedule2.orderScheduleKey).toBe(41);
          expect(schedule2.orderItemKey).toBe(31);
          expect(schedule2.quantity).toBe(5);
          expect(schedule2.totalMass).toBe(2.5);
          expect(schedule2.required).toBe(true);
          expect(schedule2.shipTo).toBe('Verona');
          expect(schedule2.shipDate).toBe(shipDate2);

          /* ---------------------------------------- */

          var order2 = orders.at(1);

          expect(order2.orderKey).toBe(13);
          expect(order2.vendorName).toBe('Black Spider');
          expect(order2.contractDate).toBe(contractDate2);
          expect(order2.totalPrice).toBe(6600.0);
          expect(order2.schedules).toBe(3);
          expect(order2.enabled).toBe(true);
          expect(order2.createdDate.getDate()).toBe(new Date().getDate());
          expect(order2.modifiedDate).toBeNull();

          address2 = order2.address;

          expect(address2.addressKey).toBe(13);
          expect(address2.orderKey).toBe(13);
          expect(address2.country).toBe('Poland');
          expect(address2.state).toBe('');
          expect(address2.city).toBe('Warsawa');
          expect(address2.line1).toBe('ul. Żeromskiego 77');
          expect(address2.line2).toBe('III piętro');
          expect(address2.postalCode).toBe('01-882');

          item3 = order2.items.at(0);

          expect(item3.orderItemKey).toBe(33);
          expect(item3.orderKey).toBe(13);
          expect(item3.productName).toBe('Platforma SIRP');
          expect(item3.obsolete).toBe(false);
          expect(item3.expiry).toBe(expiry3);
          expect(item3.quantity).toBe(110);
          expect(item3.unitPrice).toBe(60);

          schedule3 = item3.schedules.at(0);

          expect(schedule3.orderScheduleKey).toBe(42);
          expect(schedule3.orderItemKey).toBe(33);
          expect(schedule3.quantity).toBe(45);
          expect(schedule3.totalMass).toBe(540);
          expect(schedule3.required).toBe(false);
          expect(schedule3.shipTo).toBe('Krakow');
          expect(schedule3.shipDate).toBe(shipDate3);

          //endregion

          done();
      }).catch( reason => {
        console.log(reason);
      });
    });

  });
});
