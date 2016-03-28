console.log('Initializing test environment for model tests...');

var configuration = require('../../source/shared/configuration-reader.js');

describe('Test repository', function () {

  it('initialization', function () {

    configuration.initialize('/config/business-objects.js');

    global.orderKey = 0;
    global.orders = {};

    global.addressKey = 0;
    global.addresses = {};

    global.itemKey = 0;
    global.items = {};

    global.scheduleKey = 0;
    global.schedules = {};

    expect(true).toBe(true);
  });
});
