console.log('Testing fromCto methods of asynchronous models...');

var BlanketOrder_S = require('../../data/simple-mc/async/blanket-order.js');
var BlanketOrder_C = require('../../data/custom-mc/async-models/blanket-order.js');

var contractDate = new Date(2014, 12, 15, 15, 26);
var contractDate_u = new Date(2014, 12, 20, 8, 40);
var expiry1 = new Date(2015, 1, 1, 0, 0);
var expiry2 = new Date(2015, 3, 21, 0, 0);
var shipDate1 = new Date(2015, 1, 8, 12, 0);
var shipDate2 = new Date(2015, 2, 28, 16, 30);

describe('Asynchronous fromCto method', function () {

  //region Compose data for insert

  var data1 = {
    vendorName: 'Acme Corp.',
    contractDate: contractDate,
    totalPrice: 497.5,
    schedules: 2,
    enabled: true
  };
  data1.address = {
    country: 'Canada',
    state: 'Ontario',
    city: 'Toronto',
    line1: '100 Front Street W',
    line2: '',
    postalCode: 'M5J 1E3'
  };
  data1.items = [];
  data1.items.push({
    productName: 'Tablet Creek 7',
    obsolete: false,
    expiry: expiry1,
    quantity: 2,
    unitPrice: 200
  });
  data1.items.push({
    productName: 'USB 3.0 cable',
    obsolete: false,
    expiry: expiry2,
    quantity: 5,
    unitPrice: 19.5
  });
  data1.items[1].schedules = [];
  data1.items[1].schedules.push({
    quantity: 2,
    totalMass: 0.24,
    required: true,
    shipTo: 'Madrid',
    shipDate: shipDate1
  });
  data1.items[1].schedules.push({
    quantity: 3,
    totalMass: 0.36,
    required: true,
    shipTo: 'Copenhagen',
    shipDate: shipDate2
  });

  //endregion

  it('for creating sample editable model', function (done) {
    console.log('\n*** Asynchronous rebuild for sample CREATE');

    BlanketOrder_S.create().then( order => {

      order.fromCto(data1).then( () => {

        order.save().then( order => {

          //region Check data

          expect(order.orderKey).toBe(7);
          expect(order.vendorName).toBe('Acme Corp.');
          expect(order.contractDate).toBe(contractDate);
          expect(order.totalPrice).toBe(497.5);
          expect(order.schedules).toBe(2);
          expect(order.enabled).toBe(true);
          expect(order.createdDate.getDate()).toBe(new Date().getDate());
          expect(order.modifiedDate).toBeNull();

          var address = order.address;

          expect(address.addressKey).toBe(7);
          expect(address.orderKey).toBe(7);
          expect(address.country).toBe('Canada');
          expect(address.state).toBe('Ontario');
          expect(address.city).toBe('Toronto');
          expect(address.line1).toBe('100 Front Street W');
          expect(address.line2).toBe('');
          expect(address.postalCode).toBe('M5J 1E3');

          expect(order.items.count).toBe(2);

          var item1 = order.items.at(0);

          expect(item1.orderItemKey).toBe(19);
          expect(item1.orderKey).toBe(7);
          expect(item1.productName).toBe('Tablet Creek 7');
          expect(item1.obsolete).toBe(false);
          expect(item1.expiry).toBe(expiry1);
          expect(item1.quantity).toBe(2);
          expect(item1.unitPrice).toBe(200);

          var item2 = order.items.at(1);

          expect(item2.orderItemKey).toBe(20);
          expect(item2.orderKey).toBe(7);
          expect(item2.productName).toBe('USB 3.0 cable');
          expect(item2.obsolete).toBe(false);
          expect(item2.expiry).toBe(expiry2);
          expect(item2.quantity).toBe(5);
          expect(item2.unitPrice).toBe(19.5);

          expect(item1.schedules.count).toBe(0);

          expect(item2.schedules.count).toBe(2);

          var schedule1 = item2.schedules.at(0);

          expect(schedule1.orderScheduleKey).toBe(25);
          expect(schedule1.orderItemKey).toBe(20);
          expect(schedule1.quantity).toBe(2);
          expect(schedule1.totalMass).toBe(0.24);
          expect(schedule1.required).toBe(true);
          expect(schedule1.shipTo).toBe('Madrid');
          expect(schedule1.shipDate).toBe(shipDate1);

          var schedule2 = item2.schedules.at(1);

          expect(schedule2.orderScheduleKey).toBe(26);
          expect(schedule2.orderItemKey).toBe(20);
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
  });

  it('for updating sample editable model', function (done) {
    console.log('\n*** Asynchronous rebuild for sample UPDATE');

    //region Compose data for update

    var data2 = {
      orderKey: 7,
      vendorName: 'Summit Ltd.',
      contractDate: contractDate_u,
      totalPrice: 672.5,
      schedules: 3,
      enabled: false
    };
    data2.address = {
      addressKey: 7,
      orderKey: 7,
      country: 'Ireland',
      state: '',
      city: 'Dublin',
      line1: '79-81 Iona Rd',
      line2: '',
      postalCode: '9'
    };
    data2.items = [];
    data2.items.push({
      orderItemKey: 20,
      orderKey: 7,
      productName: 'USB 3.0 hub',
      obsolete: true,
      expiry: expiry1,
      quantity: 11,
      unitPrice: 49.5
    });
    data2.items.push({
      productName: 'DataExpert 32GB pen drive',
      obsolete: false,
      expiry: expiry2,
      quantity: 4,
      unitPrice: 32.0
    });
    data2.items[0].schedules = [];
    data2.items[0].schedules.push({
      orderScheduleKey: 26,
      orderItemKey: 20,
      quantity: 4,
      totalMass: 0.48,
      required: false,
      shipTo: 'Stockholm',
      shipDate: shipDate1
    });
    data2.items[0].schedules.push({
      quantity: 7,
      totalMass: 0.84,
      required: true,
      shipTo: 'Vienna',
      shipDate: shipDate2
    });
    data2.items[1].schedules = [];
    data2.items[1].schedules.push({
      quantity: 4,
      totalMass: 0.06,
      required: true,
      shipTo: 'Vienna',
      shipDate: shipDate2
    });

    //endregion

    BlanketOrder_S.get( 5 ).then( order => {

      order.fromCto(data2).then( () => {

        order.save().then( order => {

          //region Check data

          expect(order.orderKey).toBe(7);
          expect(order.vendorName).toBe('Summit Ltd.');
          expect(order.contractDate).toBe(contractDate_u);
          expect(order.totalPrice).toBe(672.5);
          expect(order.schedules).toBe(3);
          expect(order.enabled).toBe(false);
          expect(order.createdDate.getDate()).toBe(new Date().getDate());
          expect(order.modifiedDate.getDate()).toBe(new Date().getDate());

          expect(order.items.count).toBe(2);

          var item1 = order.items.at(0);

          expect(item1.orderItemKey).toBe(21);
          expect(item1.orderKey).toBe(7);
          expect(item1.productName).toBe('USB 3.0 hub');
          expect(item1.obsolete).toBe(true);
          expect(item1.expiry).toBe(expiry1);
          expect(item1.quantity).toBe(11);
          expect(item1.unitPrice).toBe(49.5);

          var item2 = order.items.at(1);

          expect(item2.orderItemKey).toBe(22);
          expect(item2.orderKey).toBe(7);
          expect(item2.productName).toBe('DataExpert 32GB pen drive');
          expect(item2.obsolete).toBe(false);
          expect(item2.expiry).toBe(expiry2);
          expect(item2.quantity).toBe(4);
          expect(item2.unitPrice).toBe(32.0);

          expect(item1.schedules.count).toBe(2);

          var schedule1 = item1.schedules.at(0);

          expect(schedule1.orderScheduleKey).toBe(27);
          expect(schedule1.orderItemKey).toBe(21);
          expect(schedule1.quantity).toBe(4);
          expect(schedule1.totalMass).toBe(0.48);
          expect(schedule1.required).toBe(false);
          expect(schedule1.shipTo).toBe('Stockholm');
          expect(schedule1.shipDate).toBe(shipDate1);

          var schedule2 = item1.schedules.at(1);

          expect(schedule2.orderScheduleKey).toBe(28);
          expect(schedule2.orderItemKey).toBe(21);
          expect(schedule2.quantity).toBe(7);
          expect(schedule2.totalMass).toBe(0.84);
          expect(schedule2.required).toBe(true);
          expect(schedule2.shipTo).toBe('Vienna');
          expect(schedule2.shipDate).toBe(shipDate2);

          expect(item2.schedules.count).toBe(1);

          var schedule3 = item2.schedules.at(0);

          expect(schedule3.orderScheduleKey).toBe(29);
          expect(schedule3.orderItemKey).toBe(22);
          expect(schedule3.quantity).toBe(4);
          expect(schedule3.totalMass).toBe(0.06);
          expect(schedule3.required).toBe(true);
          expect(schedule3.shipTo).toBe('Vienna');
          expect(schedule3.shipDate).toBe(shipDate2);

          //endregion

          done();
        });
      });
    });
  });

  it('for creating custom editable model', function (done) {
    console.log('\n*** Asynchronous rebuild for custom CREATE');

    BlanketOrder_C.create().then( order => {

      order.fromCto(data1).then( () => {

        if (order.isValid())
          order.save().then( order => {

            //region Check data

            expect(order.orderKey).toBe(8);
            expect(order.vendorName).toBe('Acme Corp.');
            expect(order.contractDate).toBe(contractDate);
            expect(order.totalPrice).toBe(497.5);
            expect(order.schedules).toBe(2);
            expect(order.enabled).toBe(true);
            expect(order.createdDate.getDate()).toBe(new Date().getDate());
            expect(order.modifiedDate).toBeNull();

            var address = order.address;

            expect(address.addressKey).toBe(8);
            expect(address.orderKey).toBe(8);
            expect(address.country).toBe('Canada');
            expect(address.state).toBe('Ontario');
            expect(address.city).toBe('Toronto');
            expect(address.line1).toBe('100 Front Street W');
            expect(address.line2).toBe('');
            expect(address.postalCode).toBe('M5J 1E3');

            expect(order.items.count).toBe(2);

            var item1 = order.items.at(0);

            expect(item1.orderItemKey).toBe(23);
            expect(item1.orderKey).toBe(8);
            expect(item1.productName).toBe('Tablet Creek 7');
            expect(item1.obsolete).toBe(false);
            expect(item1.expiry).toBe(expiry1);
            expect(item1.quantity).toBe(2);
            expect(item1.unitPrice).toBe(200);

            var item2 = order.items.at(1);

            expect(item2.orderItemKey).toBe(24);
            expect(item2.orderKey).toBe(8);
            expect(item2.productName).toBe('USB 3.0 cable');
            expect(item2.obsolete).toBe(false);
            expect(item2.expiry).toBe(expiry2);
            expect(item2.quantity).toBe(5);
            expect(item2.unitPrice).toBe(19.5);

            expect(item1.schedules.count).toBe(0);

            expect(item2.schedules.count).toBe(2);

            var schedule1 = item2.schedules.at(0);

            expect(schedule1.orderScheduleKey).toBe(30);
            expect(schedule1.orderItemKey).toBe(24);
            expect(schedule1.quantity).toBe(2);
            expect(schedule1.totalMass).toBe(0.24);
            expect(schedule1.required).toBe(true);
            expect(schedule1.shipTo).toBe('Madrid');
            expect(schedule1.shipDate).toBe(shipDate1);

            var schedule2 = item2.schedules.at(1);

            expect(schedule2.orderScheduleKey).toBe(31);
            expect(schedule2.orderItemKey).toBe(24);
            expect(schedule2.quantity).toBe(3);
            expect(schedule2.totalMass).toBe(0.36);
            expect(schedule2.required).toBe(true);
            expect(schedule2.shipTo).toBe('Copenhagen');
            expect(schedule2.shipDate).toBe(shipDate2);

            //endregion

            done();
          });
        else
          var zum = order.getBrokenRules();
      });
    });
  });

  it('for updating custom editable model', function (done) {
    console.log('\n*** Asynchronous rebuild for custom UPDATE');

    //region Compose data for update

    var data3 = {
      orderKey: 8,
      vendorName: 'Summit Ltd.',
      contractDate: contractDate_u,
      totalPrice: 672.5,
      schedules: 3,
      enabled: false
    };
    data3.address = {
      addressKey: 8,
      orderKey: 8,
      country: 'Ireland',
      state: '',
      city: 'Dublin',
      line1: '79-81 Iona Rd',
      line2: '',
      postalCode: '9'
    };
    data3.items = [];
    data3.items.push({
      orderItemKey: 24,
      orderKey: 8,
      productName: 'USB 3.0 hub',
      obsolete: true,
      expiry: expiry1,
      quantity: 11,
      unitPrice: 49.5
    });
    data3.items.push({
      productName: 'DataExpert 32GB pen drive',
      obsolete: false,
      expiry: expiry2,
      quantity: 4,
      unitPrice: 32.0
    });
    data3.items[0].schedules = [];
    data3.items[0].schedules.push({
      orderScheduleKey: 31,
      orderItemKey: 24,
      quantity: 4,
      totalMass: 0.48,
      required: false,
      shipTo: 'Stockholm',
      shipDate: shipDate1
    });
    data3.items[0].schedules.push({
      quantity: 7,
      totalMass: 0.84,
      required: true,
      shipTo: 'Vienna',
      shipDate: shipDate2
    });
    data3.items[1].schedules = [];
    data3.items[1].schedules.push({
      quantity: 4,
      totalMass: 0.06,
      required: true,
      shipTo: 'Vienna',
      shipDate: shipDate2
    });

    //endregion

    BlanketOrder_C.get( 8 ).then( order => {

      order.fromCto(data3).then( () => {

        order.save().then( order => {

          //region Check data

          expect(order.orderKey).toBe(8);
          expect(order.vendorName).toBe('Summit Ltd.');
          expect(order.contractDate).toBe(contractDate_u);
          expect(order.totalPrice).toBe(672.5);
          expect(order.schedules).toBe(3);
          expect(order.enabled).toBe(false);
          expect(order.createdDate.getDate()).toBe(new Date().getDate());
          expect(order.modifiedDate.getDate()).toBe(new Date().getDate());

          expect(order.items.count).toBe(2);

          var item1 = order.items.at(0);

          expect(item1.orderItemKey).toBe(24);
          expect(item1.orderKey).toBe(8);
          expect(item1.productName).toBe('USB 3.0 hub');
          expect(item1.obsolete).toBe(true);
          expect(item1.expiry).toBe(expiry1);
          expect(item1.quantity).toBe(11);
          expect(item1.unitPrice).toBe(49.5);

          var item2 = order.items.at(1);

          expect(item2.orderItemKey).toBe(25);
          expect(item2.orderKey).toBe(8);
          expect(item2.productName).toBe('DataExpert 32GB pen drive');
          expect(item2.obsolete).toBe(false);
          expect(item2.expiry).toBe(expiry2);
          expect(item2.quantity).toBe(4);
          expect(item2.unitPrice).toBe(32.0);

          expect(item1.schedules.count).toBe(2);

          var schedule1 = item1.schedules.at(0);

          expect(schedule1.orderScheduleKey).toBe(31);
          expect(schedule1.orderItemKey).toBe(24);
          expect(schedule1.quantity).toBe(4);
          expect(schedule1.totalMass).toBe(0.48);
          expect(schedule1.required).toBe(false);
          expect(schedule1.shipTo).toBe('Stockholm');
          expect(schedule1.shipDate).toBe(shipDate1);

          var schedule2 = item1.schedules.at(1);

          expect(schedule2.orderScheduleKey).toBe(32);
          expect(schedule2.orderItemKey).toBe(24);
          expect(schedule2.quantity).toBe(7);
          expect(schedule2.totalMass).toBe(0.84);
          expect(schedule2.required).toBe(true);
          expect(schedule2.shipTo).toBe('Vienna');
          expect(schedule2.shipDate).toBe(shipDate2);

          expect(item2.schedules.count).toBe(1);

          var schedule3 = item2.schedules.at(0);

          expect(schedule3.orderScheduleKey).toBe(33);
          expect(schedule3.orderItemKey).toBe(25);
          expect(schedule3.quantity).toBe(4);
          expect(schedule3.totalMass).toBe(0.06);
          expect(schedule3.required).toBe(true);
          expect(schedule3.shipTo).toBe('Vienna');
          expect(schedule3.shipDate).toBe(shipDate2);

          //endregion

          done();
        });
      });
    });
  });
});
