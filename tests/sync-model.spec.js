console.log('Testing data portal methods of synchronous models.js...');

var BlanketOrder = require('../sample/sync/blanket-order.js');

var contractDate = new Date(2014, 12, 15, 15, 26);
var expiry1 = new Date(2015, 1, 1, 0, 0);
var expiry2 = new Date(2015, 3, 21, 0, 0);
var shipDate1 = new Date(2015, 1, 8, 12, 0);
var shipDate2 = new Date(2015, 2, 28, 16, 30);

describe('Synchronous data portal method', function () {

  it('create', function () {
    console.log('\n*** Synchronous CREATE');

    var order = BlanketOrder.create();

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

    schedule1.productName = 'USB 3.0 cable';
    schedule1.quantity = 2;
    schedule1.mass = 0.12;
    schedule1.required = true;
    schedule1.shipDate = shipDate1;

    var schedule2 = item2.schedules.create();

    schedule1.productName = 'USB 3.0 cable';
    schedule1.quantity = 3;
    schedule1.mass = 0.12;
    schedule1.required = true;
    schedule1.shipDate = shipDate2;

    order = order.save();

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
    expect(schedule1.productName).toBe('USB 3.0 cable');
    expect(schedule1.quantity).toBe(2);
    expect(schedule1.mass).toBe(0.12);
    expect(schedule1.required).toBe(true);
    expect(schedule1.shipDate).toBe(shipDate1);

    schedule2 = item2.schedules.at(1);

    expect(schedule2.orderScheduleKey).toBe(2);
    expect(schedule2.orderItemKey).toBe(2);
    expect(schedule2.productName).toBe('USB 3.0 cable');
    expect(schedule2.quantity).toBe(3);
    expect(schedule2.mass).toBe(0.12);
    expect(schedule2.required).toBe(true);
    expect(schedule2.shipDate).toBe(shipDate2);
  });

  it('special fetch', function () {
    console.log('\n*** Synchronous GET_BY_NAME');

    var order = BlanketOrder.getByName('Acme Corp.');

    expect(order.orderKey).toBe(1);
    expect(order.vendorName).toBe('Acme Corp.');
    expect(order.contractDate).toBe(contractDate);
    expect(order.totalPrice).toBe(497.5);
    expect(order.schedules).toBe(2);
    expect(order.enabled).toBe(true);

    var address = order.address;

    expect(address.addressKey).toBe(1);
    expect(address.country).toBe('Canada');
    expect(address.state).toBe('Ontario');
    expect(address.city).toBe('Toronto');
    expect(address.line1).toBe('100 Front Street W');
    expect(address.line2).toBe('');
    expect(address.postalCode).toBe('M5J 1E3');
  });
});
