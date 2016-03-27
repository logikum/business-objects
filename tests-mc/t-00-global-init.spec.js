console.log('Initializing test repository for model tests...');

// Initialize the test environment.
var configuration = require('../source/shared/configuration-reader.js');
configuration.initialize('/config/business-objects.js');

describe('Test repository', function () {

  it('initialization', function () {

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
