console.log('Testing data portal methods of sample asynchronous root collection...');

var BlanketOrders = require('../../data/simple-mc/async/blanket-orders.js');
var BlanketOrderChild = require('../../data/simple-mc/async/blanket-order-child.js');

var DataPortalEvent = require('../../source/shared/data-portal-event.js');
var EventHandlerList = require('../../source/shared/event-handler-list.js');

var contractDate1 = new Date(2015, 10, 23, 11, 7);
var contractDate2 = new Date(2015, 10, 24, 15, 48);
var contractDate3 = new Date(2015, 11, 7, 19, 0);
var expiry1 = new Date(2016, 7, 1, 0, 0);
var expiry2 = new Date(2016, 4, 1, 0, 0);
var expiry3 = new Date(2016, 8, 20, 12, 0);
var shipDate1 = new Date(2015, 12, 21, 12, 0);
var shipDate2 = new Date(2016, 1, 12, 9, 45);
var shipDate3 = new Date(2016, 2, 5, 17, 0);

describe('Asynchronous data portal method', function () {

  //region Event handlers

  function logEvent (eventArgs) {
    var id = eventArgs.modelName + '.' + eventArgs.methodName + ':' + eventArgs.eventName;
    if (eventArgs.eventName.substr(-4) === 'Save')
      console.log(' :: ' + id + ' event.');
    else
      console.log('  : ' + id + ' event.');
  }

  var ehBlanketOrders = new EventHandlerList();
  ehBlanketOrders.add('BlanketOrders', DataPortalEvent.preCreate, logEvent);
  ehBlanketOrders.add('BlanketOrders', DataPortalEvent.postCreate, logEvent);
  ehBlanketOrders.add('BlanketOrders', DataPortalEvent.preFetch, logEvent);
  ehBlanketOrders.add('BlanketOrders', DataPortalEvent.postFetch, logEvent);
  ehBlanketOrders.add('BlanketOrders', DataPortalEvent.preInsert, logEvent);
  ehBlanketOrders.add('BlanketOrders', DataPortalEvent.postInsert, logEvent);
  ehBlanketOrders.add('BlanketOrders', DataPortalEvent.preUpdate, logEvent);
  ehBlanketOrders.add('BlanketOrders', DataPortalEvent.postUpdate, logEvent);
  ehBlanketOrders.add('BlanketOrders', DataPortalEvent.preRemove, logEvent);
  ehBlanketOrders.add('BlanketOrders', DataPortalEvent.postRemove, logEvent);
  ehBlanketOrders.add('BlanketOrders', DataPortalEvent.preSave, logEvent);
  ehBlanketOrders.add('BlanketOrders', DataPortalEvent.postSave, logEvent);
  ehBlanketOrders.add('BlanketOrderChild', DataPortalEvent.preCreate, logEvent);
  ehBlanketOrders.add('BlanketOrderChild', DataPortalEvent.postCreate, logEvent);
  ehBlanketOrders.add('BlanketOrderChild', DataPortalEvent.preFetch, logEvent);
  ehBlanketOrders.add('BlanketOrderChild', DataPortalEvent.postFetch, logEvent);
  ehBlanketOrders.add('BlanketOrderChild', DataPortalEvent.preInsert, logEvent);
  ehBlanketOrders.add('BlanketOrderChild', DataPortalEvent.postInsert, logEvent);
  ehBlanketOrders.add('BlanketOrderChild', DataPortalEvent.preUpdate, logEvent);
  ehBlanketOrders.add('BlanketOrderChild', DataPortalEvent.postUpdate, logEvent);
  ehBlanketOrders.add('BlanketOrderChild', DataPortalEvent.preRemove, logEvent);
  ehBlanketOrders.add('BlanketOrderChild', DataPortalEvent.postRemove, logEvent);
  ehBlanketOrders.add('Address', DataPortalEvent.preCreate, logEvent);
  ehBlanketOrders.add('Address', DataPortalEvent.postCreate, logEvent);
  ehBlanketOrders.add('Address', DataPortalEvent.preFetch, logEvent);
  ehBlanketOrders.add('Address', DataPortalEvent.postFetch, logEvent);
  ehBlanketOrders.add('Address', DataPortalEvent.preInsert, logEvent);
  ehBlanketOrders.add('Address', DataPortalEvent.postInsert, logEvent);
  ehBlanketOrders.add('Address', DataPortalEvent.preUpdate, logEvent);
  ehBlanketOrders.add('Address', DataPortalEvent.postUpdate, logEvent);
  ehBlanketOrders.add('Address', DataPortalEvent.preRemove, logEvent);
  ehBlanketOrders.add('Address', DataPortalEvent.postRemove, logEvent);
  ehBlanketOrders.add('BlanketOrderItem', DataPortalEvent.preCreate, logEvent);
  ehBlanketOrders.add('BlanketOrderItem', DataPortalEvent.postCreate, logEvent);
  ehBlanketOrders.add('BlanketOrderItem', DataPortalEvent.preFetch, logEvent);
  ehBlanketOrders.add('BlanketOrderItem', DataPortalEvent.postFetch, logEvent);
  ehBlanketOrders.add('BlanketOrderItem', DataPortalEvent.preInsert, logEvent);
  ehBlanketOrders.add('BlanketOrderItem', DataPortalEvent.postInsert, logEvent);
  ehBlanketOrders.add('BlanketOrderItem', DataPortalEvent.preUpdate, logEvent);
  ehBlanketOrders.add('BlanketOrderItem', DataPortalEvent.postUpdate, logEvent);
  ehBlanketOrders.add('BlanketOrderItem', DataPortalEvent.preRemove, logEvent);
  ehBlanketOrders.add('BlanketOrderItem', DataPortalEvent.postRemove, logEvent);
  ehBlanketOrders.add('BlanketOrderSchedule', DataPortalEvent.preCreate, logEvent);
  ehBlanketOrders.add('BlanketOrderSchedule', DataPortalEvent.postCreate, logEvent);
  ehBlanketOrders.add('BlanketOrderSchedule', DataPortalEvent.preFetch, logEvent);
  ehBlanketOrders.add('BlanketOrderSchedule', DataPortalEvent.postFetch, logEvent);
  ehBlanketOrders.add('BlanketOrderSchedule', DataPortalEvent.preInsert, logEvent);
  ehBlanketOrders.add('BlanketOrderSchedule', DataPortalEvent.postInsert, logEvent);
  ehBlanketOrders.add('BlanketOrderSchedule', DataPortalEvent.preUpdate, logEvent);
  ehBlanketOrders.add('BlanketOrderSchedule', DataPortalEvent.postUpdate, logEvent);
  ehBlanketOrders.add('BlanketOrderSchedule', DataPortalEvent.preRemove, logEvent);
  ehBlanketOrders.add('BlanketOrderSchedule', DataPortalEvent.postRemove, logEvent);

  var ehBlanketOrderView = new EventHandlerList();
  ehBlanketOrderView.add('BlanketOrderView', DataPortalEvent.preFetch, logEvent);
  ehBlanketOrderView.add('BlanketOrderView', DataPortalEvent.postFetch, logEvent);
  ehBlanketOrderView.add('AddressView', DataPortalEvent.preFetch, logEvent);
  ehBlanketOrderView.add('AddressView', DataPortalEvent.postFetch, logEvent);
  ehBlanketOrderView.add('BlanketOrderItemView', DataPortalEvent.preFetch, logEvent);
  ehBlanketOrderView.add('BlanketOrderItemView', DataPortalEvent.postFetch, logEvent);
  ehBlanketOrderView.add('BlanketOrderScheduleView', DataPortalEvent.preFetch, logEvent);
  ehBlanketOrderView.add('BlanketOrderScheduleView', DataPortalEvent.postFetch, logEvent);

  var ehBlanketOrderList = new EventHandlerList();
  ehBlanketOrderList.add('BlanketOrderList', DataPortalEvent.preFetch, logEvent);
  ehBlanketOrderList.add('BlanketOrderList', DataPortalEvent.postFetch, logEvent);
  ehBlanketOrderList.add('BlanketOrderListItem', DataPortalEvent.preFetch, logEvent);
  ehBlanketOrderList.add('BlanketOrderListItem', DataPortalEvent.postFetch, logEvent);

  //endregion

  it('create of sample editable collection', function (done) {
    console.log('\n*** Asynchronous collection CREATE');

    console.log('    < Create order collection >');
    BlanketOrders.create( ehBlanketOrders )
    .then( function( orders ) {

      //region Load data

      console.log('    < Create order #1 >');
      orders.createItem()
      .then( function( order1 ) {

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

        order1.items.createItem(function (err, item1) {
          if (err) throw err;

          item1.productName = 'D810A';
          item1.obsolete = false;
          item1.expiry = expiry1;
          item1.quantity = 10;
          item1.unitPrice = 30;

          order1.items.createItem(function (err, item2) {
            if (err) throw err;

            item2.productName = 'R8';
            item2.obsolete = false;
            item2.expiry = expiry2;
            item2.quantity = 5;
            item2.unitPrice = 20;

            item1.schedules.createItem(function (err, schedule1) {
              if (err) throw err;

              schedule1.quantity = 5;
              schedule1.totalMass = 2.5;
              schedule1.required = true;
              schedule1.shipTo = 'Bologna';
              schedule1.shipDate = shipDate1;

              item1.schedules.createItem(function (err, schedule2) {
                if (err) throw err;

                schedule2.quantity = 5;
                schedule2.totalMass = 2.5;
                schedule2.required = true;
                schedule2.shipTo = 'Verona';
                schedule2.shipDate = shipDate2;

                console.log('    < Create order #2 >');
                var order2 = orders.createItem()
                .then( function( order2 ) {

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

                  order2.items.createItem(function (err, item3) {
                    if (err) throw err;

                    item3.productName = 'Platforma SIRP';
                    item3.obsolete = false;
                    item3.expiry = expiry3;
                    item3.quantity = 110;
                    item3.unitPrice = 60;

                    var schedule3 = item3.schedules.createItem(function (err, schedule3) {
                      if (err) throw err;

                      schedule3.quantity = 45;
                      schedule3.totalMass = 540;
                      schedule3.required = false;
                      schedule3.shipTo = 'Krakow';
                      schedule3.shipDate = shipDate3;

                      save();
                    });
                  });
                });
              });
            });
          });
        });
      });

      //endregion

      function save() {
        console.log('    < Save order collection >');

        orders.save()
        .then( function( orders ) {

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
        });
      }
    });
  });

  it('update of sample editable collection', function (done) {
    console.log('\n*** Asynchronous collection UPDATE');

    console.log('    < Fetch order collection >');
    BlanketOrders.getFromTo( 12, 13, ehBlanketOrders )
    .then( function( orders ) {

      //region Update data

      console.log('    < Update order #1 >');
      var order1 = orders.at(0);

      order1.vendorName = 'Pink Giraffe';
      order1.contractDate = contractDate2;
      order1.totalPrice = 500.0;
      order1.schedules = 5;
      order1.enabled = false;

      var address1 = order1.address;

      address1.country = 'Italia';
      address1.state = '';
      address1.city = 'Milano';
      address1.line1 = 'Via Battistotti Sassi 13';
      address1.line2 = '';
      address1.postalCode = '20133';

      var item1 = order1.items.at(0);

      item1.productName = 'D810B';
      item1.obsolete = false;
      item1.expiry = expiry2;
      item1.quantity = 20;
      item1.unitPrice = 35;

      var item2 = order1.items.at(1);
      item2.remove();

      order1.items.createItem(function (err, item3) {
        if (err) throw err;

        item3.productName = 'Babel Tower';
        item3.obsolete = false;
        item3.expiry = expiry1;
        item3.quantity = 3;
        item3.unitPrice = 49.9;

        var schedule1 = item1.schedules.at(0);
        schedule1.remove();

        item1.schedules.createItem(function (err, schedule3) {
          if (err) throw err;

          schedule3.quantity = 10;
          schedule3.totalMass = 2.5;
          schedule3.required = false;
          schedule3.shipTo = 'Torino';
          schedule3.shipDate = shipDate2;

          var schedule2 = item1.schedules.at(1);

          schedule2.quantity = 10;
          schedule2.totalMass = 2.5;
          schedule2.required = true;
          schedule2.shipTo = 'Verona';
          schedule2.shipDate = shipDate1;

          item3.schedules.createItem(function (err, schedule4) {
            if (err) throw err;

            schedule4.quantity = 3;
            schedule4.totalMass = 23.4;
            schedule4.required = true;
            schedule4.shipTo = 'Siena';
            schedule4.shipDate = shipDate3;

            console.log('    < Delete order #2 >');
            var order2 = orders.at(1);
            order2.remove();

            console.log('    < Create order #3 >');
            orders.createItem()
            .then( function( order3 ) {

              order3.vendorName = 'Coward Rabbit';
              order3.contractDate = contractDate3;
              order3.totalPrice = 980;
              order3.schedules = 5;
              order3.enabled = false;

              var address2 = order3.address;

              address2.country = 'Slovakia';
              address2.state = '';
              address2.city = 'Komárno';
              address2.line1 = 'Ulica františkánov 22.';
              address2.line2 = '';
              address2.postalCode = '945 01';

              order3.items.createItem(function (err, item4) {
                if (err) throw err;

                item4.productName = 'OpenShift Origin';
                item4.obsolete = false;
                item4.expiry = expiry1;
                item4.quantity = 49;
                item4.unitPrice = 4.0;

                item4.schedules.createItem(function (err, schedule5) {
                  if (err) throw err;

                  schedule5.quantity = 10;
                  schedule5.totalMass = 13.7;
                  schedule5.required = true;
                  schedule5.shipTo = 'Bratislava';
                  schedule5.shipDate = shipDate3;

                  save();
                });
              });
            });
          });
        });
      });

      //endregion

      function save() {
        console.log('    < Save order collection >');

        orders.save()
        .then( function( orders ) {

          //region Check data

          expect(orders.count).toBe(2);

          /* ---------------------------------------- */

          var order1 = orders.at(0);

          expect(order1.orderKey).toBe(12);
          expect(order1.vendorName).toBe('Pink Giraffe');
          expect(order1.contractDate).toBe(contractDate2);
          expect(order1.totalPrice).toBe(500.0);
          expect(order1.schedules).toBe(5);
          expect(order1.enabled).toBe(false);
          expect(order1.createdDate.getDate()).toBe(new Date().getDate());
          expect(order1.modifiedDate.getDate()).toBe(new Date().getDate());

          address1 = order1.address;

          expect(address1.addressKey).toBe(12);
          expect(address1.orderKey).toBe(12);
          expect(address1.country).toBe('Italia');
          expect(address1.state).toBe('');
          expect(address1.city).toBe('Milano');
          expect(address1.line1).toBe('Via Battistotti Sassi 13');
          expect(address1.line2).toBe('');
          expect(address1.postalCode).toBe('20133');

          expect(order1.items.count).toBe(2);

          item1 = order1.items.at(0);

          expect(item1.orderItemKey).toBe(31);
          expect(item1.orderKey).toBe(12);
          expect(item1.productName).toBe('D810B');
          expect(item1.obsolete).toBe(false);
          expect(item1.expiry).toBe(expiry2);
          expect(item1.quantity).toBe(20);
          expect(item1.unitPrice).toBe(35);

          item2 = order1.items.at(1);

          expect(item2.orderItemKey).toBe(34);
          expect(item2.orderKey).toBe(12);
          expect(item2.productName).toBe('Babel Tower');
          expect(item2.obsolete).toBe(false);
          expect(item2.expiry).toBe(expiry1);
          expect(item2.quantity).toBe(3);
          expect(item2.unitPrice).toBe(49.9);

          expect(item1.schedules.count).toBe(2);

          expect(item2.schedules.count).toBe(1);

          schedule1 = item1.schedules.at(0);

          expect(schedule1.orderScheduleKey).toBe(41);
          expect(schedule1.orderItemKey).toBe(31);
          expect(schedule1.quantity).toBe(10);
          expect(schedule1.totalMass).toBe(2.5);
          expect(schedule1.required).toBe(true);
          expect(schedule1.shipTo).toBe('Verona');
          expect(schedule1.shipDate).toBe(shipDate1);

          schedule2 = item1.schedules.at(1);

          expect(schedule2.orderScheduleKey).toBe(43);
          expect(schedule2.orderItemKey).toBe(31);
          expect(schedule2.quantity).toBe(10);
          expect(schedule2.totalMass).toBe(2.5);
          expect(schedule2.required).toBe(false);
          expect(schedule2.shipTo).toBe('Torino');
          expect(schedule2.shipDate).toBe(shipDate2);

          schedule3 = item2.schedules.at(0);

          expect(schedule3.orderScheduleKey).toBe(44);
          expect(schedule3.orderItemKey).toBe(34);
          expect(schedule3.quantity).toBe(3);
          expect(schedule3.totalMass).toBe(23.4);
          expect(schedule3.required).toBe(true);
          expect(schedule3.shipTo).toBe('Siena');
          expect(schedule3.shipDate).toBe(shipDate3);

          /* ---------------------------------------- */

          var order2 = orders.at(1);

          expect(order2.orderKey).toBe(14);
          expect(order2.vendorName).toBe('Coward Rabbit');
          expect(order2.contractDate).toBe(contractDate3);
          expect(order2.totalPrice).toBe(980);
          expect(order2.schedules).toBe(5);
          expect(order2.enabled).toBe(false);
          expect(order2.createdDate.getDate()).toBe(new Date().getDate());
          expect(order2.modifiedDate).toBeNull();

          address2 = order2.address;

          address2.country = 'Slovakia';
          address2.state = '';
          address2.city = 'Komárno';
          address2.line1 = 'Ulica františkánov 22.';
          address2.line2 = '';
          address2.postalCode = '945 01';

          expect(address2.addressKey).toBe(14);
          expect(address2.orderKey).toBe(14);
          expect(address2.country).toBe('Slovakia');
          expect(address2.state).toBe('');
          expect(address2.city).toBe('Komárno');
          expect(address2.line1).toBe('Ulica františkánov 22.');
          expect(address2.line2).toBe('');
          expect(address2.postalCode).toBe('945 01');

          expect(order2.items.count).toBe(1);

          item3 = order2.items.at(0);

          expect(item3.orderItemKey).toBe(35);
          expect(item3.orderKey).toBe(14);
          expect(item3.productName).toBe('OpenShift Origin');
          expect(item3.obsolete).toBe(false);
          expect(item3.expiry).toBe(expiry1);
          expect(item3.quantity).toBe(49);
          expect(item3.unitPrice).toBe(4.0);

          expect(item3.schedules.count).toBe(1);

          schedule3 = item3.schedules.at(0);

          expect(schedule3.orderScheduleKey).toBe(45);
          expect(schedule3.orderItemKey).toBe(35);
          expect(schedule3.quantity).toBe(10);
          expect(schedule3.totalMass).toBe(13.7);
          expect(schedule3.required).toBe(true);
          expect(schedule3.shipTo).toBe('Bratislava');
          expect(schedule3.shipDate).toBe(shipDate3);

          //endregion

          done();
        });
      }
    });
  });

  it('client conversion of sample editable collection', function(done) {
    console.log('\n*** Asynchronous collection TO_FROM_CTO');

    console.log('    < Fetch order collection >');
    BlanketOrders.getFromTo( 12, 14, ehBlanketOrders )
    .then( function( orders1 ) {

      var data = orders1.toCto();
      BlanketOrders.create( ehBlanketOrders )
      .then( function( orders2 ) {

        orders2.fromCto(data, function (err) {
          if (err) throw err;

          //region Check data

          expect(orders2.count).toBe(2);

          /* ---------------------------------------- */

          var order1 = orders2.at(0);

          expect(order1.orderKey).toBe(12);
          expect(order1.vendorName).toBe('Pink Giraffe');
          expect(order1.contractDate).toBe(contractDate2);
          expect(order1.totalPrice).toBe(500.0);
          expect(order1.schedules).toBe(5);
          expect(order1.enabled).toBe(false);
          expect(order1.createdDate.getDate()).toBe(new Date().getDate());
          expect(order1.modifiedDate.getDate()).toBe(new Date().getDate());

          address1 = order1.address;

          expect(address1.addressKey).toBe(12);
          expect(address1.orderKey).toBe(12);
          expect(address1.country).toBe('Italia');
          expect(address1.state).toBe('');
          expect(address1.city).toBe('Milano');
          expect(address1.line1).toBe('Via Battistotti Sassi 13');
          expect(address1.line2).toBe('');
          expect(address1.postalCode).toBe('20133');

          expect(order1.items.count).toBe(2);

          item1 = order1.items.at(0);

          expect(item1.orderItemKey).toBe(31);
          expect(item1.orderKey).toBe(12);
          expect(item1.productName).toBe('D810B');
          expect(item1.obsolete).toBe(false);
          expect(item1.expiry).toBe(expiry2);
          expect(item1.quantity).toBe(20);
          expect(item1.unitPrice).toBe(35);

          item2 = order1.items.at(1);

          expect(item2.orderItemKey).toBe(34);
          expect(item2.orderKey).toBe(12);
          expect(item2.productName).toBe('Babel Tower');
          expect(item2.obsolete).toBe(false);
          expect(item2.expiry).toBe(expiry1);
          expect(item2.quantity).toBe(3);
          expect(item2.unitPrice).toBe(49.9);

          expect(item1.schedules.count).toBe(2);

          expect(item2.schedules.count).toBe(1);

          schedule1 = item1.schedules.at(0);

          expect(schedule1.orderScheduleKey).toBe(41);
          expect(schedule1.orderItemKey).toBe(31);
          expect(schedule1.quantity).toBe(10);
          expect(schedule1.totalMass).toBe(2.5);
          expect(schedule1.required).toBe(true);
          expect(schedule1.shipTo).toBe('Verona');
          expect(schedule1.shipDate).toBe(shipDate1);

          schedule2 = item1.schedules.at(1);

          expect(schedule2.orderScheduleKey).toBe(43);
          expect(schedule2.orderItemKey).toBe(31);
          expect(schedule2.quantity).toBe(10);
          expect(schedule2.totalMass).toBe(2.5);
          expect(schedule2.required).toBe(false);
          expect(schedule2.shipTo).toBe('Torino');
          expect(schedule2.shipDate).toBe(shipDate2);

          schedule3 = item2.schedules.at(0);

          expect(schedule3.orderScheduleKey).toBe(44);
          expect(schedule3.orderItemKey).toBe(34);
          expect(schedule3.quantity).toBe(3);
          expect(schedule3.totalMass).toBe(23.4);
          expect(schedule3.required).toBe(true);
          expect(schedule3.shipTo).toBe('Siena');
          expect(schedule3.shipDate).toBe(shipDate3);

          /* ---------------------------------------- */

          var order2 = orders2.at(1);

          expect(order2.orderKey).toBe(14);
          expect(order2.vendorName).toBe('Coward Rabbit');
          expect(order2.contractDate).toBe(contractDate3);
          expect(order2.totalPrice).toBe(980);
          expect(order2.schedules).toBe(5);
          expect(order2.enabled).toBe(false);
          expect(order2.createdDate.getDate()).toBe(new Date().getDate());
          expect(order2.modifiedDate).toBeNull();

          address2 = order2.address;

          address2.country = 'Slovakia';
          address2.state = '';
          address2.city = 'Komárno';
          address2.line1 = 'Ulica františkánov 22.';
          address2.line2 = '';
          address2.postalCode = '945 01';

          expect(address2.addressKey).toBe(14);
          expect(address2.orderKey).toBe(14);
          expect(address2.country).toBe('Slovakia');
          expect(address2.state).toBe('');
          expect(address2.city).toBe('Komárno');
          expect(address2.line1).toBe('Ulica františkánov 22.');
          expect(address2.line2).toBe('');
          expect(address2.postalCode).toBe('945 01');

          expect(order2.items.count).toBe(1);

          item3 = order2.items.at(0);

          expect(item3.orderItemKey).toBe(35);
          expect(item3.orderKey).toBe(14);
          expect(item3.productName).toBe('OpenShift Origin');
          expect(item3.obsolete).toBe(false);
          expect(item3.expiry).toBe(expiry1);
          expect(item3.quantity).toBe(49);
          expect(item3.unitPrice).toBe(4.0);

          expect(item3.schedules.count).toBe(1);

          schedule3 = item3.schedules.at(0);

          expect(schedule3.orderScheduleKey).toBe(45);
          expect(schedule3.orderItemKey).toBe(35);
          expect(schedule3.quantity).toBe(10);
          expect(schedule3.totalMass).toBe(13.7);
          expect(schedule3.required).toBe(true);
          expect(schedule3.shipTo).toBe('Bratislava');
          expect(schedule3.shipDate).toBe(shipDate3);

          //endregion

          done();
        });
      });
    });
  });

  it('delete of sample editable collection', function (done) {
    console.log('\n*** Asynchronous collection REMOVE');

    console.log('    < Fetch order collection >');
    BlanketOrders.getFromTo( 12, 14, ehBlanketOrders )
      .then( function( orders ) {

      console.log('    < Remove order collection >');
      orders.remove();
      orders.save()
      .then( function( orders ) {

        //region Check data

        expect(orders).toBeNull();

        console.log('    < Re-fetch order collection >');
        var exOrders = BlanketOrders.getFromTo( 12, 14, ehBlanketOrders )
          .then( function( exOrders ) {

          expect(exOrders.count).toBe(0);

          done();
        });

        //endregion
      });
    });
  });
});
