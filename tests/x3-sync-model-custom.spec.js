'use strict';

console.log('Testing data portal methods of custom synchronous models...');

var BlanketOrder = require('../custom/sync-models/blanket-order.js');
var BlanketOrderView = require('../custom/sync-models/blanket-order-view.js');
var BlanketOrderList = require('../custom/sync-models/blanket-order-list.js');

var DataPortalEvent = require('../source/shared/data-portal-event.js');
var EventHandlerList = require('../source/shared/event-handler-list.js');

var contractDate = new Date(2014, 12, 15, 15, 26);
var contractDate_u = new Date(2014, 12, 20, 8, 40);
var expiry1 = new Date(2015, 1, 1, 0, 0);
var expiry2 = new Date(2015, 3, 21, 0, 0);
var shipDate1 = new Date(2015, 1, 8, 12, 0);
var shipDate2 = new Date(2015, 2, 28, 16, 30);

describe('Synchronous data portal method', function () {

  //region Event handlers

  function logEvent (eventArgs, oldObject) {
    var text = eventArgs.modelName + '.' + eventArgs.methodName + ':' + eventArgs.eventName + ' event.';
    if (eventArgs.eventName.substr(-4) === 'Save')
      console.log(' :: ' + text);
    else
      console.log('  : ' + text);
  }

  var ehBlanketOrder = new EventHandlerList();
  ehBlanketOrder.add('BlanketOrder', DataPortalEvent.preCreate, logEvent);
  ehBlanketOrder.add('BlanketOrder', DataPortalEvent.postCreate, logEvent);
  ehBlanketOrder.add('BlanketOrder', DataPortalEvent.preFetch, logEvent);
  ehBlanketOrder.add('BlanketOrder', DataPortalEvent.postFetch, logEvent);
  ehBlanketOrder.add('BlanketOrder', DataPortalEvent.preInsert, logEvent);
  ehBlanketOrder.add('BlanketOrder', DataPortalEvent.postInsert, logEvent);
  ehBlanketOrder.add('BlanketOrder', DataPortalEvent.preUpdate, logEvent);
  ehBlanketOrder.add('BlanketOrder', DataPortalEvent.postUpdate, logEvent);
  ehBlanketOrder.add('BlanketOrder', DataPortalEvent.preRemove, logEvent);
  ehBlanketOrder.add('BlanketOrder', DataPortalEvent.postRemove, logEvent);
  ehBlanketOrder.add('BlanketOrder', DataPortalEvent.preSave, logEvent);
  ehBlanketOrder.add('BlanketOrder', DataPortalEvent.postSave, logEvent);
  ehBlanketOrder.add('Address', DataPortalEvent.preCreate, logEvent);
  ehBlanketOrder.add('Address', DataPortalEvent.postCreate, logEvent);
  ehBlanketOrder.add('Address', DataPortalEvent.preFetch, logEvent);
  ehBlanketOrder.add('Address', DataPortalEvent.postFetch, logEvent);
  ehBlanketOrder.add('Address', DataPortalEvent.preInsert, logEvent);
  ehBlanketOrder.add('Address', DataPortalEvent.postInsert, logEvent);
  ehBlanketOrder.add('Address', DataPortalEvent.preUpdate, logEvent);
  ehBlanketOrder.add('Address', DataPortalEvent.postUpdate, logEvent);
  ehBlanketOrder.add('Address', DataPortalEvent.preRemove, logEvent);
  ehBlanketOrder.add('Address', DataPortalEvent.postRemove, logEvent);
  ehBlanketOrder.add('BlanketOrderItem', DataPortalEvent.preCreate, logEvent);
  ehBlanketOrder.add('BlanketOrderItem', DataPortalEvent.postCreate, logEvent);
  ehBlanketOrder.add('BlanketOrderItem', DataPortalEvent.preFetch, logEvent);
  ehBlanketOrder.add('BlanketOrderItem', DataPortalEvent.postFetch, logEvent);
  ehBlanketOrder.add('BlanketOrderItem', DataPortalEvent.preInsert, logEvent);
  ehBlanketOrder.add('BlanketOrderItem', DataPortalEvent.postInsert, logEvent);
  ehBlanketOrder.add('BlanketOrderItem', DataPortalEvent.preUpdate, logEvent);
  ehBlanketOrder.add('BlanketOrderItem', DataPortalEvent.postUpdate, logEvent);
  ehBlanketOrder.add('BlanketOrderItem', DataPortalEvent.preRemove, logEvent);
  ehBlanketOrder.add('BlanketOrderItem', DataPortalEvent.postRemove, logEvent);
  ehBlanketOrder.add('BlanketOrderSchedule', DataPortalEvent.preCreate, logEvent);
  ehBlanketOrder.add('BlanketOrderSchedule', DataPortalEvent.postCreate, logEvent);
  ehBlanketOrder.add('BlanketOrderSchedule', DataPortalEvent.preFetch, logEvent);
  ehBlanketOrder.add('BlanketOrderSchedule', DataPortalEvent.postFetch, logEvent);
  ehBlanketOrder.add('BlanketOrderSchedule', DataPortalEvent.preInsert, logEvent);
  ehBlanketOrder.add('BlanketOrderSchedule', DataPortalEvent.postInsert, logEvent);
  ehBlanketOrder.add('BlanketOrderSchedule', DataPortalEvent.preUpdate, logEvent);
  ehBlanketOrder.add('BlanketOrderSchedule', DataPortalEvent.postUpdate, logEvent);
  ehBlanketOrder.add('BlanketOrderSchedule', DataPortalEvent.preRemove, logEvent);
  ehBlanketOrder.add('BlanketOrderSchedule', DataPortalEvent.postRemove, logEvent);

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

  it('create of custom editable model', function () {
    console.log('\n*** Synchronous CREATE');

    var order = BlanketOrder.create(ehBlanketOrder);

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

    expect(order.orderKey).toBe(3);
    expect(order.orderCode).toBe('11');
    expect(order.vendorName).toBe('Acme Corp.');
    expect(order.contractDate).toBe(contractDate);
    expect(order.totalPrice).toBe(497.5);
    expect(order.schedules).toBe(2);
    expect(order.enabled).toBe(true);
    expect(order.createdDate.getDate()).toBe(new Date().getDate());
    expect(order.modifiedDate).toBeNull();

    address = order.address;

    expect(address.addressKey).toBe(3);
    expect(address.addressCode).toBe('11');
    expect(address.orderKey).toBe(3);
    expect(address.country).toBe('Canada');
    expect(address.state).toBe('Ontario');
    expect(address.city).toBe('Toronto');
    expect(address.line1).toBe('100 Front Street W');
    expect(address.line2).toBe('');
    expect(address.postalCode).toBe('M5J 1E3');

    expect(order.items.count).toBe(2);

    item1 = order.items.at(0);

    expect(item1.orderItemKey).toBe(7);
    expect(item1.orderItemCode).toBe('111');
    expect(item1.orderKey).toBe(3);
    expect(item1.productName).toBe('Tablet Creek 7');
    expect(item1.obsolete).toBe(false);
    expect(item1.expiry).toBe(expiry1);
    expect(item1.quantity).toBe(2);
    expect(item1.unitPrice).toBe(200);

    item2 = order.items.at(1);

    expect(item2.orderItemKey).toBe(8);
    expect(item2.orderItemCode).toBe('1000');
    expect(item2.orderKey).toBe(3);
    expect(item2.productName).toBe('USB 3.0 cable');
    expect(item2.obsolete).toBe(false);
    expect(item2.expiry).toBe(expiry2);
    expect(item2.quantity).toBe(5);
    expect(item2.unitPrice).toBe(19.5);

    expect(item1.schedules.count).toBe(0);

    expect(item2.schedules.count).toBe(2);

    schedule1 = item2.schedules.at(0);

    expect(schedule1.orderScheduleKey).toBe(9);
    expect(schedule1.orderScheduleCode).toBe('1001');
    expect(schedule1.orderItemKey).toBe(8);
    expect(schedule1.quantity).toBe(2);
    expect(schedule1.totalMass).toBe(0.24);
    expect(schedule1.required).toBe(true);
    expect(schedule1.shipTo).toBe('Madrid');
    expect(schedule1.shipDate).toBe(shipDate1);

    schedule2 = item2.schedules.at(1);

    expect(schedule2.orderScheduleKey).toBe(10);
    expect(schedule2.orderScheduleCode).toBe('1010');
    expect(schedule2.orderItemKey).toBe(8);
    expect(schedule2.quantity).toBe(3);
    expect(schedule2.totalMass).toBe(0.36);
    expect(schedule2.required).toBe(true);
    expect(schedule2.shipTo).toBe('Copenhagen');
    expect(schedule2.shipDate).toBe(shipDate2);

    //endregion
  });

  it('special fetch of custom editable model', function () {
    console.log('\n*** Synchronous GET_BY_NAME');

    var order = BlanketOrder.getByName('Acme Corp.', ehBlanketOrder);

    //region Check data

    expect(order.orderKey).toBe(3);
    expect(order.orderCode).toBe('11');
    expect(order.vendorName).toBe('Acme Corp.');
    expect(order.contractDate).toBe(contractDate);
    expect(order.totalPrice).toBe(497.5);
    expect(order.schedules).toBe(2);
    expect(order.enabled).toBe(true);
    expect(order.createdDate.getDate()).toBe(new Date().getDate());
    expect(order.modifiedDate).toBeNull();

    var address = order.address;

    expect(address.addressKey).toBe(3);
    expect(address.addressCode).toBe('11');
    expect(address.orderKey).toBe(3);
    expect(address.country).toBe('Canada');
    expect(address.state).toBe('Ontario');
    expect(address.city).toBe('Toronto');
    expect(address.line1).toBe('100 Front Street W');
    expect(address.line2).toBe('');
    expect(address.postalCode).toBe('M5J 1E3');

    expect(order.items.count).toBe(2);

    var item1 = order.items.at(0);

    expect(item1.orderItemKey).toBe(7);
    expect(item1.orderItemCode).toBe('111');
    expect(item1.orderKey).toBe(3);
    expect(item1.productName).toBe('Tablet Creek 7');
    expect(item1.obsolete).toBe(false);
    expect(item1.expiry).toBe(expiry1);
    expect(item1.quantity).toBe(2);
    expect(item1.unitPrice).toBe(200);

    var item2 = order.items.at(1);

    expect(item2.orderItemKey).toBe(8);
    expect(item2.orderItemCode).toBe('1000');
    expect(item2.orderKey).toBe(3);
    expect(item2.productName).toBe('USB 3.0 cable');
    expect(item2.obsolete).toBe(false);
    expect(item2.expiry).toBe(expiry2);
    expect(item2.quantity).toBe(5);
    expect(item2.unitPrice).toBe(19.5);

    expect(item1.schedules.count).toBe(0);

    expect(item2.schedules.count).toBe(2);

    var schedule1 = item2.schedules.at(0);

    expect(schedule1.orderScheduleKey).toBe(9);
    expect(schedule1.orderScheduleCode).toBe('1001');
    expect(schedule1.orderItemKey).toBe(8);
    expect(schedule1.quantity).toBe(2);
    expect(schedule1.totalMass).toBe(0.24);
    expect(schedule1.required).toBe(true);
    expect(schedule1.shipTo).toBe('Madrid');
    expect(schedule1.shipDate).toBe(shipDate1);

    var schedule2 = item2.schedules.at(1);

    expect(schedule2.orderScheduleKey).toBe(10);
    expect(schedule2.orderScheduleCode).toBe('1010');
    expect(schedule2.orderItemKey).toBe(8);
    expect(schedule2.quantity).toBe(3);
    expect(schedule2.totalMass).toBe(0.36);
    expect(schedule2.required).toBe(true);
    expect(schedule2.shipTo).toBe('Copenhagen');
    expect(schedule2.shipDate).toBe(shipDate2);

    //endregion

    //region Check client transfer object

    var cto = order.toCto();

    expect(cto.orderKey).toBeUndefined();
    expect(cto.orderCode).toBe('11');
    expect(cto.vendorName).toBe('Acme Corp.');
    expect(cto.contractDate).toBe(contractDate);
    expect(cto.totalPrice).toBe(497.5);
    expect(cto.schedules).toBe(2);
    expect(cto.enabled).toBe(true);
    expect(cto.createdDate.getDate()).toBe(new Date().getDate());
    expect(cto.modifiedDate).toBeNull();

    expect(cto.address.addressKey).toBeUndefined();
    expect(cto.address.addressCode).toBe('11');
    expect(cto.address.orderKey).toBeUndefined();
    expect(cto.address.country).toBe('Canada');
    expect(cto.address.state).toBe('Ontario');
    expect(cto.address.city).toBe('Toronto');
    expect(cto.address.line1).toBe('100 Front Street W');
    expect(cto.address.line2).toBe('');
    expect(cto.address.postalCode).toBe('M5J 1E3');

    expect(cto.items[0].orderItemKey).toBeUndefined();
    expect(cto.items[0].orderItemCode).toBe('111');
    expect(cto.items[0].orderKey).toBeUndefined();
    expect(cto.items[0].productName).toBe('Tablet Creek 7');
    expect(cto.items[0].obsolete).toBe(false);
    expect(cto.items[0].expiry).toBe(expiry1);
    expect(cto.items[0].quantity).toBe(2);
    expect(cto.items[0].unitPrice).toBe(200);

    expect(cto.items[1].orderItemKey).toBeUndefined();
    expect(cto.items[1].orderItemCode).toBe('1000');
    expect(cto.items[1].orderKey).toBeUndefined();
    expect(cto.items[1].productName).toBe('USB 3.0 cable');
    expect(cto.items[1].obsolete).toBe(false);
    expect(cto.items[1].expiry).toBe(expiry2);
    expect(cto.items[1].quantity).toBe(5);
    expect(cto.items[1].unitPrice).toBe(19.5);

    expect(cto.items[1].schedules[0].orderScheduleKey).toBeUndefined();
    expect(cto.items[1].schedules[0].orderScheduleCode).toBe('1001');
    expect(cto.items[1].schedules[0].orderItemKey).toBeUndefined();
    expect(cto.items[1].schedules[0].quantity).toBe(2);
    expect(cto.items[1].schedules[0].totalMass).toBe(0.24);
    expect(cto.items[1].schedules[0].required).toBe(true);
    expect(cto.items[1].schedules[0].shipTo).toBe('Madrid');
    expect(cto.items[1].schedules[0].shipDate).toBe(shipDate1);

    expect(cto.items[1].schedules[1].orderScheduleKey).toBeUndefined();
    expect(cto.items[1].schedules[1].orderScheduleCode).toBe('1010');
    expect(cto.items[1].schedules[1].orderItemKey).toBeUndefined();
    expect(cto.items[1].schedules[1].quantity).toBe(3);
    expect(cto.items[1].schedules[1].totalMass).toBe(0.36);
    expect(cto.items[1].schedules[1].required).toBe(true);
    expect(cto.items[1].schedules[1].shipTo).toBe('Copenhagen');
    expect(cto.items[1].schedules[1].shipDate).toBe(shipDate2);

    //endregion
  });

  it('fetch of custom read-only model', function () {
    console.log('\n*** Synchronous GET');

    var orderView = BlanketOrderView.get(3, ehBlanketOrderView);

    //region Check data

    expect(orderView.orderKey).toBe(3);
    expect(orderView.orderCode).toBe('11');
    expect(orderView.vendorName).toBe('Acme Corp.');
    expect(orderView.contractDate).toBe(contractDate);
    expect(orderView.totalPrice).toBe(497.5);
    expect(orderView.schedules).toBe(2);
    expect(orderView.enabled).toBe(true);
    expect(orderView.createdDate.getDate()).toBe(new Date().getDate());
    expect(orderView.modifiedDate).toBeNull();

    var addressView = orderView.address;

    expect(addressView.addressKey).toBe(3);
    expect(addressView.addressCode).toBe('11');
    expect(addressView.orderKey).toBe(3);
    expect(addressView.country).toBe('Canada');
    expect(addressView.state).toBe('Ontario');
    expect(addressView.city).toBe('Toronto');
    expect(addressView.line1).toBe('100 Front Street W');
    expect(addressView.line2).toBe('');
    expect(addressView.postalCode).toBe('M5J 1E3');

    expect(orderView.items.count).toBe(2);

    var itemView1 = orderView.items.at(0);

    expect(itemView1.orderItemKey).toBe(7);
    expect(itemView1.orderItemCode).toBe('111');
    expect(itemView1.orderKey).toBe(3);
    expect(itemView1.productName).toBe('Tablet Creek 7');
    expect(itemView1.obsolete).toBe(false);
    expect(itemView1.expiry).toBe(expiry1);
    expect(itemView1.quantity).toBe(2);
    expect(itemView1.unitPrice).toBe(200);

    var itemView2 = orderView.items.at(1);

    expect(itemView2.orderItemKey).toBe(8);
    expect(itemView2.orderItemCode).toBe('1000');
    expect(itemView2.orderKey).toBe(3);
    expect(itemView2.productName).toBe('USB 3.0 cable');
    expect(itemView2.obsolete).toBe(false);
    expect(itemView2.expiry).toBe(expiry2);
    expect(itemView2.quantity).toBe(5);
    expect(itemView2.unitPrice).toBe(19.5);

    expect(itemView1.schedules.count).toBe(0);

    expect(itemView2.schedules.count).toBe(2);

    var scheduleView1 = itemView2.schedules.at(0);

    expect(scheduleView1.orderScheduleKey).toBe(9);
    expect(scheduleView1.orderScheduleCode).toBe('1001');
    expect(scheduleView1.orderItemKey).toBe(8);
    expect(scheduleView1.quantity).toBe(2);
    expect(scheduleView1.totalMass).toBe(0.24);
    expect(scheduleView1.required).toBe(true);
    expect(scheduleView1.shipTo).toBe('Madrid');
    expect(scheduleView1.shipDate).toBe(shipDate1);

    var scheduleView2 = itemView2.schedules.at(1);

    expect(scheduleView2.orderScheduleKey).toBe(10);
    expect(scheduleView2.orderScheduleCode).toBe('1010');
    expect(scheduleView2.orderItemKey).toBe(8);
    expect(scheduleView2.quantity).toBe(3);
    expect(scheduleView2.totalMass).toBe(0.36);
    expect(scheduleView2.required).toBe(true);
    expect(scheduleView2.shipTo).toBe('Copenhagen');
    expect(scheduleView2.shipDate).toBe(shipDate2);

    //endregion

    //region Check write protection

    function write11 () { orderView.orderKey = 111; }
    function write12 () { orderView.orderCode = '10101'; }
    function write13 () { orderView.vendorName = 'Purple Cactus, Ltd.'; }
    function write14 () { orderView.contractDate = expiry1; }
    function write15 () { orderView.totalPrice = 6508.2; }
    function write16 () { orderView.schedules = 7; }
    function write17 () { orderView.enabled = false; }
    function write18 () { orderView.createdDate = shipDate1; }
    function write19 () { orderView.modifiedDate = shipDate2; }

    function write21 () { addressView.addressKey = 222; }
    function write22 () { addressView.addressCode = '11011'; }
    function write23 () { addressView.orderKey = 111; }
    function write24 () { addressView.country = 'USA'; }
    function write25 () { addressView.state = 'Massachusetts'; }
    function write26 () { addressView.city = 'Boston'; }
    function write27 () { addressView.line1 = '32 King Road'; }
    function write28 () { addressView.line2 = 'Floor 6, apt. 34'; }
    function write29 () { addressView.postalCode = 'ABC 123'; }

    function write31 () { itemView1.orderItemKey = 333; }
    function write32 () { itemView1.orderItemCode = '101010'; }
    function write33 () { itemView1.orderKey = 111; }
    function write34 () { itemView1.productName = 'Yellow T-shirt'; }
    function write35 () { itemView1.obsolete = true; }
    function write36 () { itemView1.expiry = contractDate; }
    function write37 () { itemView1.quantity = 100; }
    function write38 () { itemView1.unitPrice = 7.85; }

    function write41 () { scheduleView1.orderScheduleKey = 444; }
    function write42 () { scheduleView1.orderScheduleCode = '111000111'; }
    function write43 () { scheduleView1.orderItemKey = 333; }
    function write44 () { scheduleView1.quantity = 13; }
    function write45 () { scheduleView1.totalMass = 1.22; }
    function write46 () { scheduleView1.required = false; }
    function write47 () { scheduleView1.shipTo = 'Helsinki'; }
    function write48 () { scheduleView1.shipDate = expiry2; }

    expect(write11).toThrow('BlanketOrderView.orderKey property is read-only.');
    expect(write12).toThrow('BlanketOrderView.orderCode property is read-only.');
    expect(write13).toThrow('BlanketOrderView.vendorName property is read-only.');
    expect(write14).toThrow('BlanketOrderView.contractDate property is read-only.');
    expect(write15).toThrow('BlanketOrderView.totalPrice property is read-only.');
    expect(write16).toThrow('BlanketOrderView.schedules property is read-only.');
    expect(write17).toThrow('BlanketOrderView.enabled property is read-only.');
    expect(write18).toThrow('BlanketOrderView.createdDate property is read-only.');
    expect(write19).toThrow('BlanketOrderView.modifiedDate property is read-only.');

    expect(write21).toThrow('AddressView.addressKey property is read-only.');
    expect(write22).toThrow('AddressView.addressCode property is read-only.');
    expect(write23).toThrow('AddressView.orderKey property is read-only.');
    expect(write24).toThrow('AddressView.country property is read-only.');
    expect(write25).toThrow('AddressView.state property is read-only.');
    expect(write26).toThrow('AddressView.city property is read-only.');
    expect(write27).toThrow('AddressView.line1 property is read-only.');
    expect(write28).toThrow('AddressView.line2 property is read-only.');
    expect(write29).toThrow('AddressView.postalCode property is read-only.');

    expect(write31).toThrow('BlanketOrderItemView.orderItemKey property is read-only.');
    expect(write32).toThrow('BlanketOrderItemView.orderItemCode property is read-only.');
    expect(write33).toThrow('BlanketOrderItemView.orderKey property is read-only.');
    expect(write34).toThrow('BlanketOrderItemView.productName property is read-only.');
    expect(write35).toThrow('BlanketOrderItemView.obsolete property is read-only.');
    expect(write36).toThrow('BlanketOrderItemView.expiry property is read-only.');
    expect(write37).toThrow('BlanketOrderItemView.quantity property is read-only.');
    expect(write38).toThrow('BlanketOrderItemView.unitPrice property is read-only.');

    expect(write41).toThrow('BlanketOrderScheduleView.orderScheduleKey property is read-only.');
    expect(write42).toThrow('BlanketOrderScheduleView.orderScheduleCode property is read-only.');
    expect(write43).toThrow('BlanketOrderScheduleView.orderItemKey property is read-only.');
    expect(write44).toThrow('BlanketOrderScheduleView.quantity property is read-only.');
    expect(write45).toThrow('BlanketOrderScheduleView.totalMass property is read-only.');
    expect(write46).toThrow('BlanketOrderScheduleView.required property is read-only.');
    expect(write47).toThrow('BlanketOrderScheduleView.shipTo property is read-only.');
    expect(write48).toThrow('BlanketOrderScheduleView.shipDate property is read-only.');

    //endregion

    //region Check client transfer object

    var cto = orderView.toCto();

    expect(cto.orderKey).toBeUndefined();
    expect(cto.orderCode).toBe('11');
    expect(cto.vendorName).toBe('Acme Corp.');
    expect(cto.contractDate).toBe(contractDate);
    expect(cto.totalPrice).toBe(497.5);
    expect(cto.schedules).toBe(2);
    expect(cto.enabled).toBe(true);
    expect(cto.createdDate.getDate()).toBe(new Date().getDate());
    expect(cto.modifiedDate).toBeNull();

    expect(cto.address.addressKey).toBeUndefined();
    expect(cto.address.addressCode).toBe('11');
    expect(cto.address.orderKey).toBeUndefined();
    expect(cto.address.country).toBe('Canada');
    expect(cto.address.state).toBe('Ontario');
    expect(cto.address.city).toBe('Toronto');
    expect(cto.address.line1).toBe('100 Front Street W');
    expect(cto.address.line2).toBe('');
    expect(cto.address.postalCode).toBe('M5J 1E3');

    expect(cto.items[0].orderItemKey).toBeUndefined();
    expect(cto.items[0].orderItemCode).toBe('111');
    expect(cto.items[0].orderKey).toBeUndefined();
    expect(cto.items[0].productName).toBe('Tablet Creek 7');
    expect(cto.items[0].obsolete).toBe(false);
    expect(cto.items[0].expiry).toBe(expiry1);
    expect(cto.items[0].quantity).toBe(2);
    expect(cto.items[0].unitPrice).toBe(200);

    expect(cto.items[1].orderItemKey).toBeUndefined();
    expect(cto.items[1].orderItemCode).toBe('1000');
    expect(cto.items[1].orderKey).toBeUndefined();
    expect(cto.items[1].productName).toBe('USB 3.0 cable');
    expect(cto.items[1].obsolete).toBe(false);
    expect(cto.items[1].expiry).toBe(expiry2);
    expect(cto.items[1].quantity).toBe(5);
    expect(cto.items[1].unitPrice).toBe(19.5);

    expect(cto.items[1].schedules[0].orderScheduleKey).toBeUndefined();
    expect(cto.items[1].schedules[0].orderScheduleCode).toBe('1001');
    expect(cto.items[1].schedules[0].orderItemKey).toBeUndefined();
    expect(cto.items[1].schedules[0].quantity).toBe(2);
    expect(cto.items[1].schedules[0].totalMass).toBe(0.24);
    expect(cto.items[1].schedules[0].required).toBe(true);
    expect(cto.items[1].schedules[0].shipTo).toBe('Madrid');
    expect(cto.items[1].schedules[0].shipDate).toBe(shipDate1);

    expect(cto.items[1].schedules[1].orderScheduleKey).toBeUndefined();
    expect(cto.items[1].schedules[1].orderScheduleCode).toBe('1010');
    expect(cto.items[1].schedules[1].orderItemKey).toBeUndefined();
    expect(cto.items[1].schedules[1].quantity).toBe(3);
    expect(cto.items[1].schedules[1].totalMass).toBe(0.36);
    expect(cto.items[1].schedules[1].required).toBe(true);
    expect(cto.items[1].schedules[1].shipTo).toBe('Copenhagen');
    expect(cto.items[1].schedules[1].shipDate).toBe(shipDate2);

    //endregion
  });

  it('fetch of custom read-only collection', function () {
    console.log('\n*** Synchronous GET_ALL');

    var orderList = BlanketOrderList.getAll(ehBlanketOrderList);

    //region Check data

    expect(orderList.count).toBe(1);

    var orderListItem = orderList.at(0);

    expect(orderListItem.orderKey).toBe(3);
    expect(orderListItem.orderCode).toBe('11');
    expect(orderListItem.vendorName).toBe('Acme Corp.');
    expect(orderListItem.contractDate).toBe(contractDate);
    expect(orderListItem.totalPrice).toBe(497.5);
    expect(orderListItem.schedules).toBe(2);
    expect(orderListItem.enabled).toBe(true);
    expect(orderListItem.createdDate.getDate()).toBe(new Date().getDate());
    expect(orderListItem.modifiedDate).toBeNull();

    //endregion

    //region Check write protection

    function write1 () { orderListItem.orderKey = 111; }
    function write2 () { orderListItem.orderCode = '10101'; }
    function write3 () { orderListItem.vendorName = 'Purple Cactus, Ltd.'; }
    function write4 () { orderListItem.contractDate = expiry1; }
    function write5 () { orderListItem.totalPrice = 6508.2; }
    function write6 () { orderListItem.schedules = 7; }
    function write7 () { orderListItem.enabled = false; }
    function write8 () { orderListItem.createdDate = shipDate1; }
    function write9 () { orderListItem.modifiedDate = shipDate2; }

    expect(write1).toThrow('BlanketOrderListItem.orderKey property is read-only.');
    expect(write2).toThrow('BlanketOrderListItem.orderCode property is read-only.');
    expect(write3).toThrow('BlanketOrderListItem.vendorName property is read-only.');
    expect(write4).toThrow('BlanketOrderListItem.contractDate property is read-only.');
    expect(write5).toThrow('BlanketOrderListItem.totalPrice property is read-only.');
    expect(write6).toThrow('BlanketOrderListItem.schedules property is read-only.');
    expect(write7).toThrow('BlanketOrderListItem.enabled property is read-only.');
    expect(write8).toThrow('BlanketOrderListItem.createdDate property is read-only.');
    expect(write9).toThrow('BlanketOrderListItem.modifiedDate property is read-only.');

    //endregion

    //region Check client transfer object

    var cto = orderList.toCto();
    var ctoItem = cto[0];

    expect(ctoItem.orderKey).toBeUndefined();
    expect(ctoItem.orderCode).toBe('11');
    expect(ctoItem.vendorName).toBe('Acme Corp.');
    expect(ctoItem.contractDate).toBe(contractDate);
    expect(ctoItem.totalPrice).toBe(497.5);
    expect(ctoItem.schedules).toBe(2);
    expect(ctoItem.enabled).toBe(true);
    expect(ctoItem.createdDate.getDate()).toBe(new Date().getDate());
    expect(ctoItem.modifiedDate).toBeNull();

    //endregion
  });

  it('update of custom editable model', function () {
    console.log('\n*** Synchronous SAVE');

    var order = BlanketOrder.get(3, ehBlanketOrder);

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

    expect(order.orderKey).toBe(3);
    expect(order.orderCode).toBe('11');
    expect(order.vendorName).toBe('Summit Ltd.');
    expect(order.contractDate).toBe(contractDate_u);
    expect(order.totalPrice).toBe(672.5);
    expect(order.schedules).toBe(3);
    expect(order.enabled).toBe(false);
    expect(order.createdDate.getDate()).toBe(new Date().getDate());
    expect(order.modifiedDate.getDate()).toBe(new Date().getDate());

    expect(order.items.count).toBe(2);

    item1 = order.items.at(0);

    expect(item1.orderItemKey).toBe(8);
    expect(item1.orderItemCode).toBe('1000');
    expect(item1.orderKey).toBe(3);
    expect(item1.productName).toBe('USB 3.0 hub');
    expect(item1.obsolete).toBe(true);
    expect(item1.expiry).toBe(expiry1);
    expect(item1.quantity).toBe(11);
    expect(item1.unitPrice).toBe(49.5);

    item2 = order.items.at(1);

    expect(item2.orderItemKey).toBe(9);
    expect(item2.orderItemCode).toBe('1001');
    expect(item2.orderKey).toBe(3);
    expect(item2.productName).toBe('DataExpert 32GB pen drive');
    expect(item2.obsolete).toBe(false);
    expect(item2.expiry).toBe(expiry2);
    expect(item2.quantity).toBe(4);
    expect(item2.unitPrice).toBe(32.0);

    expect(item1.schedules.count).toBe(2);

    schedule1 = item1.schedules.at(0);

    expect(schedule1.orderScheduleKey).toBe(10);
    expect(schedule1.orderScheduleCode).toBe('1010');
    expect(schedule1.orderItemKey).toBe(8);
    expect(schedule1.quantity).toBe(4);
    expect(schedule1.totalMass).toBe(0.48);
    expect(schedule1.required).toBe(false);
    expect(schedule1.shipTo).toBe('Stockholm');
    expect(schedule1.shipDate).toBe(shipDate1);

    schedule2 = item1.schedules.at(1);

    expect(schedule2.orderScheduleKey).toBe(11);
    expect(schedule2.orderScheduleCode).toBe('1011');
    expect(schedule2.orderItemKey).toBe(8);
    expect(schedule2.quantity).toBe(7);
    expect(schedule2.totalMass).toBe(0.84);
    expect(schedule2.required).toBe(true);
    expect(schedule2.shipTo).toBe('Vienna');
    expect(schedule2.shipDate).toBe(shipDate2);

    expect(item2.schedules.count).toBe(1);

    schedule3 = item2.schedules.at(0);

    expect(schedule3.orderScheduleKey).toBe(12);
    expect(schedule3.orderScheduleCode).toBe('1100');
    expect(schedule3.orderItemKey).toBe(9);
    expect(schedule3.quantity).toBe(4);
    expect(schedule3.totalMass).toBe(0.06);
    expect(schedule3.required).toBe(true);
    expect(schedule3.shipTo).toBe('Vienna');
    expect(schedule3.shipDate).toBe(shipDate2);

    //endregion
  });

  it('delete of custom editable model', function () {
    console.log('\n*** Synchronous REMOVE');

    var order = BlanketOrder.get(3, ehBlanketOrder);
    order.remove();
    var result = order.save();

    expect(result).toBeNull();

    expect(order.getModelState()).toBe('removed');
    expect(order.address.getModelState()).toBe('removed');
    expect(order.items.count).toBe(0);
  });
});
