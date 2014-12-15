console.log('Testing data portal methods of synchronous models.js...');

var BlanketOrder = require('../sample/sync/blanket-order.js');

describe('Synchronous data portal method', function () {

  it('create', function () {

    var order = BlanketOrder.create();

    //order.orderKey = 1;
    order.vendorName = 'Acme Corp.';
    order.contractDate = new Date();
    order.totalPrice = 512.5;
    order.schedules = 2;
    order.enabled = true;

    order = order.save();

    expect(true).toBe(true);
  });
});
