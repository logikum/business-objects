console.log('Testing data portal methods of synchronous models.js...');

var BlanketOrder = require('../sample/sync/blanket-order.js');

var contractDate = new Date(2014, 12, 15, 15, 26);
var contractDate_u = new Date(2014, 12, 20, 8, 40);
var expiry1 = new Date(2015, 1, 1, 0, 0);
var expiry2 = new Date(2015, 3, 21, 0, 0);
var shipDate1 = new Date(2015, 1, 8, 12, 0);
var shipDate2 = new Date(2015, 2, 28, 16, 30);

describe('Synchronous data portal method', function () {

  it('create', function () {
    console.log('\n*** Synchronous CREATE');

    var order = BlanketOrder.create();

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

    var item1 = order.items.create();

    item1.productName = 'Tablet Creek 7';
    item1.obsolete = false;
    item1.expiry = expiry1;
    item1.quantity = 2;
    item1.unitPrice = 200;

    var item2 = order.items.create();

    item2.productName = 'USB 3.0 cable';
    item2.obsolete = false;
    item2.expiry = expiry2;
    item2.quantity = 5;
    item2.unitPrice = 19.5;

    var schedule1 = item2.schedules.create();

    schedule1.quantity = 2;
    schedule1.totalMass = 0.24;
    schedule1.required = true;
    schedule1.shipTo = 'Madrid';
    schedule1.shipDate = shipDate1;

    var schedule2 = item2.schedules.create();

    schedule2.quantity = 3;
    schedule2.totalMass = 0.36;
    schedule2.required = true;
    schedule2.shipTo = 'Copenhagen';
    schedule2.shipDate = shipDate2;

    //endregion

    order = order.save();

    //region Check data

    expect(order.orderKey).toBe(1);
    expect(order.vendorName).toBe('Acme Corp.');
    expect(order.contractDate).toBe(contractDate);
    expect(order.totalPrice).toBe(497.5);
    expect(order.schedules).toBe(2);
    expect(order.enabled).toBe(true);

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

    item1 = order.items.at(0);

    expect(item1.orderItemKey).toBe(1);
    expect(item1.orderKey).toBe(1);
    expect(item1.productName).toBe('Tablet Creek 7');
    expect(item1.obsolete).toBe(false);
    expect(item1.expiry).toBe(expiry1);
    expect(item1.quantity).toBe(2);
    expect(item1.unitPrice).toBe(200);

    item2 = order.items.at(1);

    expect(item2.orderItemKey).toBe(2);
    expect(item2.orderKey).toBe(1);
    expect(item2.productName).toBe('USB 3.0 cable');
    expect(item2.obsolete).toBe(false);
    expect(item2.expiry).toBe(expiry2);
    expect(item2.quantity).toBe(5);
    expect(item2.unitPrice).toBe(19.5);

    expect(item1.schedules.count).toBe(0);

    expect(item2.schedules.count).toBe(2);

    schedule1 = item2.schedules.at(0);

    expect(schedule1.orderScheduleKey).toBe(1);
    expect(schedule1.orderItemKey).toBe(2);
    expect(schedule1.quantity).toBe(2);
    expect(schedule1.totalMass).toBe(0.24);
    expect(schedule1.required).toBe(true);
    expect(schedule1.shipTo).toBe('Madrid');
    expect(schedule1.shipDate).toBe(shipDate1);

    schedule2 = item2.schedules.at(1);

    expect(schedule2.orderScheduleKey).toBe(2);
    expect(schedule2.orderItemKey).toBe(2);
    expect(schedule2.quantity).toBe(3);
    expect(schedule2.totalMass).toBe(0.36);
    expect(schedule2.required).toBe(true);
    expect(schedule2.shipTo).toBe('Copenhagen');
    expect(schedule2.shipDate).toBe(shipDate2);

    //endregion
  });

  it('special fetch', function () {
    console.log('\n*** Synchronous GET_BY_NAME');

    var order = BlanketOrder.getByName('Acme Corp.');

    //region Check data

    expect(order.orderKey).toBe(1);
    expect(order.vendorName).toBe('Acme Corp.');
    expect(order.contractDate).toBe(contractDate);
    expect(order.totalPrice).toBe(497.5);
    expect(order.schedules).toBe(2);
    expect(order.enabled).toBe(true);

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
  });

  it('update', function () {
    console.log('\n*** Synchronous SAVE');

    var order = BlanketOrder.get(1);

    //region Update data

    order.vendorName = 'Summit Ltd.';
    order.contractDate = contractDate_u;
    order.totalPrice = 672.5;
    order.schedules = 3;
    order.enabled = false;

    var item1 = order.items.at(0);
    item1.remove();

    var item2 = order.items.at(1);

    item2.productName = 'USB 3.0 hub';
    item2.obsolete = true;
    item2.expiry = expiry1;
    item2.quantity = 11;
    item2.unitPrice = 49.5;

    var item3 = order.items.create();

    item3.productName = 'DataExpert 32GB pen drive';
    item3.obsolete = false;
    item3.expiry = expiry2;
    item3.quantity = 4;
    item3.unitPrice = 32.0;

    var schedule1 = item2.schedules.at(0);
    schedule1.remove();

    var schedule2 = item2.schedules.at(1);

    schedule2.quantity = 4;
    schedule2.totalMass = 0.48;
    schedule2.required = false;
    schedule2.shipTo = 'Stockholm';
    schedule2.shipDate = shipDate1;

    var schedule3 = item2.schedules.create();

    schedule3.quantity = 7;
    schedule3.totalMass = 0.84;
    schedule3.required = true;
    schedule3.shipTo = 'Vienna';
    schedule3.shipDate = shipDate2;

    var schedule4 = item3.schedules.create();

    schedule4.quantity = 4;
    schedule4.totalMass = 0.06;
    schedule4.required = true;
    schedule4.shipTo = 'Vienna';
    schedule4.shipDate = shipDate2;

    //endregion

    order = order.save();

    //region Check data

    expect(order.orderKey).toBe(1);
    expect(order.vendorName).toBe('Summit Ltd.');
    expect(order.contractDate).toBe(contractDate_u);
    expect(order.totalPrice).toBe(672.5);
    expect(order.schedules).toBe(3);
    expect(order.enabled).toBe(false);

    expect(order.items.count).toBe(2);

    item1 = order.items.at(0);

    expect(item1.orderItemKey).toBe(2);
    expect(item1.orderKey).toBe(1);
    expect(item1.productName).toBe('USB 3.0 hub');
    expect(item1.obsolete).toBe(true);
    expect(item1.expiry).toBe(expiry1);
    expect(item1.quantity).toBe(11);
    expect(item1.unitPrice).toBe(49.5);

    item2 = order.items.at(1);

    expect(item2.orderItemKey).toBe(3);
    expect(item2.orderKey).toBe(1);
    expect(item2.productName).toBe('DataExpert 32GB pen drive');
    expect(item2.obsolete).toBe(false);
    expect(item2.expiry).toBe(expiry2);
    expect(item2.quantity).toBe(4);
    expect(item2.unitPrice).toBe(32.0);

    expect(item1.schedules.count).toBe(2);

    schedule1 = item1.schedules.at(0);

    expect(schedule1.orderScheduleKey).toBe(2);
    expect(schedule1.orderItemKey).toBe(2);
    expect(schedule1.quantity).toBe(4);
    expect(schedule1.totalMass).toBe(0.48);
    expect(schedule1.required).toBe(false);
    expect(schedule1.shipTo).toBe('Stockholm');
    expect(schedule1.shipDate).toBe(shipDate1);

    schedule2 = item1.schedules.at(1);

    expect(schedule2.orderScheduleKey).toBe(3);
    expect(schedule2.orderItemKey).toBe(2);
    expect(schedule2.quantity).toBe(7);
    expect(schedule2.totalMass).toBe(0.84);
    expect(schedule2.required).toBe(true);
    expect(schedule2.shipTo).toBe('Vienna');
    expect(schedule2.shipDate).toBe(shipDate2);

    expect(item2.schedules.count).toBe(1);

    schedule3 = item2.schedules.at(0);

    expect(schedule3.orderScheduleKey).toBe(4);
    expect(schedule3.orderItemKey).toBe(3);
    expect(schedule3.quantity).toBe(4);
    expect(schedule3.totalMass).toBe(0.06);
    expect(schedule3.required).toBe(true);
    expect(schedule3.shipTo).toBe('Vienna');
    expect(schedule3.shipDate).toBe(shipDate2);

    //endregion
  });

  it('delete', function () {
    console.log('\n*** Synchronous REMOVE');

    var order = BlanketOrder.get(1);
    order.remove();
    var result = order.save();

    expect(result).toBeNull();

    expect(order.getModelState()).toBe('removed');
    expect(order.address.getModelState()).toBe('removed');
    expect(order.items.count).toBe(0);
  });
});
